const { catchAsyncError } = require("../middlewares/catchAsyncError");
const ClockinDetails = require("../models/ClockinDetails");

exports.getClockinDetails = catchAsyncError(async (req, res, next) => {
    // Retrieve clockin details for all employees
    const clockinDetails = await ClockinDetails.find().populate('employee', "firstName lastName avatar");
  
    res.status(200).json({
      success: true,
      clockinDetails: clockinDetails
    });
  });
  
  exports.updateClockinTime = catchAsyncError(async (req, res, next) => {
    const { clockInTime } = req.body;
    // Update the clockin time for a specific employee
    const clockindetails = await ClockinDetails.findById(req.params.id);
    if(clockInTime) {
        clockindetails.clockInTime = clockInTime
    }

    await clockindetails.save()
    res.status(200).json({
      success: true,
      message: "Clockin Time Updated",
      clockindetails
    });
  });
  