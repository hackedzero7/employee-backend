const mongoose = require('mongoose');

const clockinDetailsSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  clockInTime: {
    type: Date,
    required: true
  },
  
},{
    timestamps: true
});

module.exports = mongoose.model('ClockinDetails', clockinDetailsSchema);
