const express = require('express');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const AIProcessor = require('../utils/aiProcessor');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'complaint-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, JPG, PNG, GIF) are allowed'));
    }
  }
});

// Submit new complaint
router.post('/submit', authenticateToken, upload.single('image'), [
  body('complaint_text').trim().isLength({ min: 10, max: 2000 }).withMessage('Complaint text must be 10-2000 characters'),
  body('location').trim().isLength({ min: 3, max: 200 }).withMessage('Location must be 3-200 characters'),
  body('pincode').matches(/^\d{6}$/).withMessage('Please enter a valid 6-digit pincode')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { complaint_text, location, pincode } = req.body;
    const uploaded_image_url = req.file ? `/uploads/${req.file.filename}` : null;

    // Process complaint with AI
    const aiResult = await AIProcessor.processComplaint(complaint_text);

    // Check for duplicate complaints
    const existingComplaints = await Complaint.find({
      status: { $in: ['Pending', 'In Progress'] }
    }).sort({ created_at: -1 }).limit(50);

    let isDuplicate = false;
    let duplicateOf = null;

    for (const existing of existingComplaints) {
      const similarity = AIProcessor.calculateSimilarity(complaint_text, existing.complaint_text);
      if (similarity > 0.8) {
        isDuplicate = true;
        duplicateOf = existing._id;
        
        // Add upvote to existing complaint instead of creating new one
        await existing.addUpvote();
        
        // Add reward points to original user
        const originalUser = await User.findById(existing.user_id);
        if (originalUser) {
          originalUser.reward_points += 2;
          await originalUser.save();
        }
        
        break;
      }
    }

    if (isDuplicate) {
      return res.json({
        message: 'This appears to be a duplicate complaint. We have added your upvote to the existing complaint.',
        is_duplicate: true,
        duplicate_complaint_id: duplicateOf,
        complaint_id: (await Complaint.findById(duplicateOf)).complaint_id
      });
    }

    // Create new complaint
    const complaint = new Complaint({
      user_id: req.user._id,
      complaint_text,
      translated_text: aiResult.translated_text,
      location,
      pincode,
      uploaded_image_url,
      department: aiResult.department,
      priority_level: aiResult.priority_level,
      ai_suggestions: aiResult.ai_suggestions
    });

    await complaint.save();

    // Add reward points to user for submitting complaint
    const user = await User.findById(req.user._id);
    user.reward_points += 10;
    await user.save();

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint: {
        complaint_id: complaint.complaint_id,
        department: complaint.department,
        priority_level: complaint.priority_level,
        status: complaint.status,
        ai_suggestions: complaint.ai_suggestions,
        created_at: complaint.created_at
      }
    });
  } catch (error) {
    console.error('Complaint submission error:', error);
    res.status(500).json({ error: 'Failed to submit complaint' });
  }
});

// Get all complaints (Admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      department,
      priority_level,
      status,
      pincode,
      search
    } = req.query;

    // Build filter
    const filter = {};
    if (department) filter.department = department;
    if (priority_level) filter.priority_level = priority_level;
    if (status) filter.status = status;
    if (pincode) filter.pincode = pincode;
    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const complaints = await Complaint.find(filter)
      .populate('user_id', 'name email phone')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Complaint.countDocuments(filter);

    res.json({
      complaints,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / limit),
        total_complaints: total,
        per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
});

// Get user's complaints
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user is requesting their own complaints or is admin
    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const complaints = await Complaint.find({ user_id: userId })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Complaint.countDocuments({ user_id: userId });

    res.json({
      complaints,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / limit),
        total_complaints: total,
        per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get user complaints error:', error);
    res.status(500).json({ error: 'Failed to fetch user complaints' });
  }
});

// Get complaint by ID
router.get('/status/:complaintId', async (req, res) => {
  try {
    const { complaintId } = req.params;

    const complaint = await Complaint.findOne({ complaint_id: complaintId })
      .populate('user_id', 'name email phone');

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    res.json({
      complaint: {
        complaint_id: complaint.complaint_id,
        department: complaint.department,
        priority_level: complaint.priority_level,
        status: complaint.status,
        upvotes: complaint.upvotes,
        created_at: complaint.created_at,
        updated_at: complaint.updated_at,
        resolved_date: complaint.resolved_date,
        location: complaint.location,
        pincode: complaint.pincode,
        complaint_text: complaint.complaint_text,
        uploaded_image_url: complaint.uploaded_image_url,
        admin_notes: complaint.admin_notes
      }
    });
  } catch (error) {
    console.error('Get complaint status error:', error);
    res.status(500).json({ error: 'Failed to fetch complaint status' });
  }
});

// Get complaints by location/pincode
router.get('/location/:pincode', async (req, res) => {
  try {
    const { pincode } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const complaints = await Complaint.find({ pincode })
      .populate('user_id', 'name')
      .select('complaint_id department priority_level status upvotes created_at location')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Complaint.countDocuments({ pincode });

    res.json({
      complaints,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / limit),
        total_complaints: total,
        per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get complaints by location error:', error);
    res.status(500).json({ error: 'Failed to fetch complaints by location' });
  }
});

// Update complaint status (Admin only)
router.put('/update-status', authenticateToken, requireAdmin, [
  body('complaint_id').notEmpty().withMessage('Complaint ID is required'),
  body('status').isIn(['Pending', 'In Progress', 'Resolved']).withMessage('Invalid status'),
  body('admin_notes').optional().trim().isLength({ max: 500 }).withMessage('Admin notes cannot exceed 500 characters')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { complaint_id, status, admin_notes } = req.body;

    const complaint = await Complaint.findOne({ complaint_id });
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    const oldStatus = complaint.status;
    complaint.status = status;
    
    if (admin_notes) {
      complaint.admin_notes = admin_notes;
    }

    if (status === 'Resolved') {
      complaint.resolved_date = new Date();
      complaint.priority_level = 'Green';
      
      // Add reward points to user for resolved complaint
      const user = await User.findById(complaint.user_id);
      if (user) {
        user.reward_points += 5;
        await user.save();
      }
    }

    await complaint.save();

    res.json({
      message: 'Complaint status updated successfully',
      complaint: {
        complaint_id: complaint.complaint_id,
        status: complaint.status,
        priority_level: complaint.priority_level,
        admin_notes: complaint.admin_notes,
        resolved_date: complaint.resolved_date,
        updated_at: complaint.updated_at
      }
    });
  } catch (error) {
    console.error('Update complaint status error:', error);
    res.status(500).json({ error: 'Failed to update complaint status' });
  }
});

// Upvote complaint
router.post('/upvote', authenticateToken, [
  body('complaint_id').notEmpty().withMessage('Complaint ID is required')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { complaint_id } = req.body;

    const complaint = await Complaint.findOne({ complaint_id });
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    // Check if user is trying to upvote their own complaint
    if (complaint.user_id.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'You cannot upvote your own complaint' });
    }

    await complaint.addUpvote();

    // Add reward points to complaint owner
    const complaintOwner = await User.findById(complaint.user_id);
    if (complaintOwner) {
      complaintOwner.reward_points += 2;
      await complaintOwner.save();
    }

    res.json({
      message: 'Complaint upvoted successfully',
      upvotes: complaint.upvotes
    });
  } catch (error) {
    console.error('Upvote complaint error:', error);
    res.status(500).json({ error: 'Failed to upvote complaint' });
  }
});

// Get analytics data (Admin only)
router.get('/analytics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: 'Pending' });
    const inProgressComplaints = await Complaint.countDocuments({ status: 'In Progress' });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'Resolved' });

    // Get complaints by department
    const complaintsByDepartment = await Complaint.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get complaints by priority
    const complaintsByPriority = await Complaint.aggregate([
      {
        $group: {
          _id: '$priority_level',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get recent resolved complaints
    const recentResolved = await Complaint.find({ status: 'Resolved' })
      .populate('user_id', 'name')
      .sort({ resolved_date: -1 })
      .limit(5);

    res.json({
      total_complaints: totalComplaints,
      pending_complaints: pendingComplaints,
      in_progress_complaints: inProgressComplaints,
      resolved_complaints: resolvedComplaints,
      complaints_by_department: complaintsByDepartment,
      complaints_by_priority: complaintsByPriority,
      recent_resolved: recentResolved
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

module.exports = router;
