const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    clockInTime: {
      type: Date,
    },
    breakStartTime: {
      type: Date,
    },
    breakEndTime: {
      type: Date,
    },
    afterBreakTime: {
      type: Date
    },
    clockOutTime: {
      type: Date,
    },
    updateClockinTime:{
      type: Date
    },
    notes: {
      type: String,
    },
    totalWorkTime: {
      type: String
    },
    totalBreakTime:{
      type: String
    },
    status: {
      type: String,
      enum: ["present", "absent", "onBreak"],
      default: "absent",
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Schedule", scheduleSchema);
