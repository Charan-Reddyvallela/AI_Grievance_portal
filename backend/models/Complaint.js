const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  complaint_id: {
    type: String,
    required: true,
    unique: true,
    default: function() {
      return 'COMP' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    }
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  complaint_text: {
    type: String,
    required: [true, 'Complaint text is required'],
    trim: true,
    maxlength: [2000, 'Complaint text cannot exceed 2000 characters']
  },
  translated_text: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  pincode: {
    type: String,
    required: [true, 'Pincode is required'],
    trim: true,
    match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode']
  },
  uploaded_image_url: {
    type: String,
    default: null
  },
  department: {
    type: String,
    required: true,
    enum: [
      'Sanitation Department',
      'Electrical Department', 
      'Water Department',
      'Roads Department',
      'Healthcare Department',
      'General Administration'
    ]
  },
  priority_level: {
    type: String,
    required: true,
    enum: ['Red', 'Yellow', 'Green'],
    default: 'Yellow'
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending'
  },
  upvotes: {
    type: Number,
    default: 0,
    min: 0
  },
  is_duplicate: {
    type: Boolean,
    default: false
  },
  duplicate_of: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
    default: null
  },
  ai_suggestions: {
    type: String,
    default: null
  },
  admin_notes: {
    type: String,
    default: null
  },
  resolved_date: {
    type: Date,
    default: null
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes for efficient querying
complaintSchema.index({ complaint_text: 'text' });
complaintSchema.index({ location: 1 });
complaintSchema.index({ pincode: 1 });
complaintSchema.index({ department: 1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ priority_level: 1 });
complaintSchema.index({ user_id: 1 });
complaintSchema.index({ created_at: -1 });

// Method to update status and set resolved date
complaintSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  if (newStatus === 'Resolved') {
    this.resolved_date = new Date();
    this.priority_level = 'Green';
  }
  return this.save();
};

// Method to add upvote
complaintSchema.methods.addUpvote = function() {
  this.upvotes += 1;
  return this.save();
};

module.exports = mongoose.model('Complaint', complaintSchema);
