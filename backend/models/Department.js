const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  department_name: {
    type: String,
    required: [true, 'Department name is required'],
    unique: true,
    trim: true,
    enum: [
      'Sanitation Department',
      'Electrical Department',
      'Water Department', 
      'Roads Department',
      'Healthcare Department',
      'General Administration'
    ]
  },
  department_email: {
    type: String,
    required: [true, 'Department email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  department_head: {
    type: String,
    required: [true, 'Department head name is required'],
    trim: true,
    maxlength: [100, 'Department head name cannot exceed 100 characters']
  },
  contact_phone: {
    type: String,
    required: [true, 'Contact phone is required'],
    trim: true,
    match: [/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number']
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// department_name index is already created by unique: true on the field

module.exports = mongoose.model('Department', departmentSchema);
