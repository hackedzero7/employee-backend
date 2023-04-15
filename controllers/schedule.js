const { catchAsyncError } = require("../middlewares/catchAsyncError");
const Schedule = require("../models/Schedule");

exports.getEmployeeSchedule = catchAsyncError(async (req, res, next) => {
    const {id} = req.params;
    const schedule = await Schedule.find({empolyee: id}).populate('employeeId','firstName lastName email userName');
    res.status(200).json({
        success: true,
        schedule
    })
})
// Admin get all employee schedule
exports.getAllEmployeeSchedule = catchAsyncError(async (req, res, next) => {
    const schedules = await Schedule.find({}).populate('employeeId', 'firstName lastName email');
      
    res.status(200).json({ 
        success: true,
        schedules
    });
  });
  