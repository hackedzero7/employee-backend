const { catchAsyncError } = require("../middlewares/catchAsyncError");
const Leave = require("../models/Leave");
const { transporter } = require("../utils/nodemailer");
const Mailgen = require('mailgen');
exports.createLeaveReaquest = catchAsyncError(async (req, res , next) => {
    const { leaveType, from, to, numberOfDays, leaveReason } = req.body;

    // Create new leave request
    const newLeave = new Leave({
      leaveType,
      from,
      to,
      numberOfDays,
      leaveReason,
      employee: req.employee._id
    });

    // Save the leave request to the database
    await newLeave.save();

    res.status(201).json({
      success: true,
      message: "Leave request created successfully",
      data: newLeave
    });
})

// for admin get all employee leave requests

exports.getallleaveRequestforAdmin = catchAsyncError(async (req, res, next) => {
    const leaveRequests = await Leave.find().populate("employee", "firstName lastName email");
    const pendingCount = await Leave.countDocuments({ status: 'Pending' });
    res.status(200).json({
    success: true,
    count: leaveRequests.length,
    leaves: leaveRequests,
    pendingCount
  });
})





exports.updateLeaveRequestStatus = catchAsyncError(async (req, res, next) => {
  const { status, reason, email } = req.body;
  // Check if leave request exists
  const leaveRequest = await Leave.findById(req.params.id);
  if (!leaveRequest) {
    return next(new ErrorHandler('Leave request not found', 404));
  }

  // Update leave request status
  leaveRequest.status = status;
  await leaveRequest.save();

  // Create MailGenerator instance
  const mailGenerator = new Mailgen({
    theme: 'salted',
    product: {
      // Product name for the email
      name: 'All Med Solutions',
      link: 'https://yourproductwebsite.com/',
      // Optional product logo
      logo: 'https://yourproductwebsite.com/logo.png'
    }
  });

  // Generate email template
const emailTemplate = {
  body: {
    intro: 'The status of your leave request has been updated:',
    table: {
      data: [
        {
          key: 'Status:',
          value: status
        },
        {
          key: 'Reason:',
          value: reason
        }
      ]
    },
    outro: 'If you have any questions, please contact us.'
  }
};

  
  // Generate HTML email using MailGenerator
  const emailBody = mailGenerator.generate(emailTemplate);
  const emailText = mailGenerator.generatePlaintext(emailTemplate);

  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: email,
    subject: `Leave Request ${status}`,
    html: emailBody,
    text: emailText
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });

  res.status(200).json({
    success: true,
    message: `Leave request ${status}`,
    data: leaveRequest
  });
});


