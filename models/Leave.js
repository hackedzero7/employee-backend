const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  leaveType: {
    type: String,
    required: [true, "Leave type is required."]
  },
  from: {
    type: Date,
    required: [true, "From date is required."]
  },
  to: {
    type: Date,
    required: [true, "To date is required."]
  },
  numberOfDays: {
    type: Number,
    required: [true, "Number of days is required."]
  },
  leaveReason: {
    type: String,
    required: [true, "Leave reason is required."]
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: [true, "Employee ID is required."]
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Leave', leaveSchema);
