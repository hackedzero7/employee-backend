const { catchAsyncError } = require("../middlewares/catchAsyncError");
const Employee = require("../models/Employee");
const Schedule = require("../models/Schedule");
const ErrorHandler = require("../utils/errorHandler");
const { sendToken } = require("../utils/sendToken");
const getDataUri = require("../utils/dataUri");
const cloudinary = require("cloudinary");
const ClockinDetails = require("../models/ClockinDetails");
exports.registerEmployee = catchAsyncError(async (req, res, next) => {
  const {
    firstName,
    lastName,
    userName,
    email,
    password,
    phone,
    department,
    designation,
    cnic,
    homePhone,
    address,
    dob,
    gender,
    religion,
    bloodGroup,
  } = req.body;

  // Check if the email already exists
  const existingEmployee = await Employee.findOne({ email });
  if (existingEmployee) {
    return next(new ErrorHandler("Email already exists", 400));
  }

  // Check if the phone number is valid
  // const phoneRegex = /^\d{10}$/;
  // if (!phoneRegex.test(phone)) {
  //   return next(new ErrorHandler("Invalid phone number", 400));
  // }
  // const homePhoneRegex = /^\d{10}$/;
  // if (!homePhoneRegex.test(homePhone)) {
  //   return next(new ErrorHandler("Invalid phone number", 400));
  // }
  const file = req.file;
  const fileUri = getDataUri(file);
  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);
  // Create new employee
  const specificIP = "111.119.187.57";
  const newEmployee = new Employee({
    firstName,
    lastName,
    userName,
    email,
    password,
    phone,
    department,
    designation,
    cnic,
    homePhone,
    address,
    dob,
    gender,
    religion,
    bloodGroup,
    avatar: { public_id: mycloud.public_id, url: mycloud.secure_url },
    ipRestrictions: [specificIP],
  });

  // Save the employee to the database
  await newEmployee.save();

  res.status(201).json({
    success: true,
    message: "Successfully registered employee",
  });
});

exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  
  if(!email){
    return next(new ErrorHandler('Please enter the email', 400))
  }
  if(!password){
    return next(new ErrorHandler('Please enter the password', 400))
  }
  const employee = await Employee.findOne({ email }).select("+password");
  if (!employee) {
    return next(new ErrorHandler("Incorrect email or password", 401));
  }

  const isMatch = await employee.comparePassword(password);
  if (!isMatch) {
    return next(new ErrorHandler("Incorrect email or password", 401));
  }
  sendToken(res, employee, `Welcome back ${employee.firstName}`, 200);
});

exports.getMyProfile = catchAsyncError(async (req, res, next) => {
  const employee = await Employee.findById(req.employee._id);
  res.status(200).json({
    success: true,
    employee,
  });
});

exports.updateProfilePicture = catchAsyncError(async (req, res, next) => {
  const employee = await Employee.findById(req.employee._id);
  const file = req.file;
  const fileUri = getDataUri(file);
  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);
  await cloudinary.v2.uploader.destroy(employee.avatar.public_id);
  employee.avatar = {
    public_id: mycloud.public_id,
    url: mycloud.secure_url,
  };
  await employee.save();
  res.status(200).json({
    success: true,
    message: "Profile Picture Updated Successfully",
  });
});

// Admin get all employees

exports.getAllEmployees = catchAsyncError(async (req, res, next) => {
  const allemployees = await Employee.find({});
  res.status(200).json({
    success: true,
    allemployees: allemployees,
    count: allemployees.length,
  });
});

exports.updateEmployee = catchAsyncError(async (req, res, next) => {
  const {
    firstName,
    lastName,
    userName,
    email,
    password,
    phone,
    department,
    designation,
    cnic,
    homePhone,
    address,
    dob,
    gender,
    religion,
    bloodGroup,
  } = req.body;

  // Find the employee by ID
  let employee = await Employee.findById(req.params.id);

  if (!employee) {
    return next(new ErrorHandler("Employee not found", 404));
  }

  // Update the employee's information
  employee.firstName = firstName || employee.firstName;
  employee.lastName = lastName || employee.lastName;
  employee.userName = userName || employee.userName;
  employee.email = email || employee.email;
  employee.password = password || employee.password;
  employee.phone = phone || employee.phone;
  employee.department = department || employee.department;
  employee.designation = designation || employee.designation;
  employee.cnic = cnic || employee.cnic;
  employee.homePhone = homePhone || employee.homePhone;
  employee.address = address || employee.address;
  employee.dob = dob || employee.dob;
  employee.gender = gender || employee.gender;
  employee.religion = religion || employee.religion;
  employee.bloodGroup = bloodGroup || employee.bloodGroup;

  // Update the employee's avatar if a new avatar is provided
  if (req.file) {
    const file = req.file;
    const fileUri = getDataUri(file);
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);
    employee.avatar = { public_id: mycloud.public_id, url: mycloud.secure_url };
  }

  // Save the updated employee to the database
  await employee.save();

  res.status(200).json({
    success: true,
    message: "Employee updated successfully",
    employee,
  });
});

exports.deleteEmployee = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;

  // Check if employee exists
  const employee = await Employee.findById(id);
  if (!employee) {
    return next(new ErrorHandler("Employee not found", 404));
  }

  // Delete employee from the database
  await Employee.findByIdAndDelete(id);

  // Delete employee avatar from Cloudinary
  await cloudinary.v2.uploader.destroy(employee.avatar.public_id);

  res.status(200).json({
    success: true,
    message: "Successfully deleted employee",
  });
});

exports.getEmployeeDetails = catchAsyncError(async (req, res, next) => {
  // Find the employee with the given ID
  const employee = await Employee.findById(req.params.id);

  if (!employee) {
    return next(new ErrorHandler("Employee not found", 404));
  }

  res.status(200).json({
    success: true,
    employeeDetail: employee,
  });
});

/**logout controller */
exports.logout = catchAsyncError(async (req, res, next) => {
  // Check if user is authenticated
  if (!req.cookies.token) {
    return next(new ErrorHandler("You are not logged in", 401));
  }

  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json({
      success: true,
      message: "Logout Successfully",
    });
});

exports.getUpcomingBirthdays = catchAsyncError(async (req, res, next) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const upcoming = await Employee.find({
    dob: {
      $gte: tomorrow,
      $lte: new Date(today.getFullYear(), today.getMonth() + 2, 0),
    },
  }).select("firstName lastName dob avatar");

  res.status(200).json({
    success: true,
    upcoming,
  });
});

exports.clockIn = catchAsyncError(async (req, res, next) => {
  const employeeId = req.params.id;

  // Create a new clockin details entry
  const clockinDetails = new ClockinDetails({
    employee: employeeId,
    clockInTime: Date.now(),
  });

  await clockinDetails.save();

  // Update the employee with clockin time and status
  const employee = await Employee.findByIdAndUpdate(
    employeeId,
    { clockInTime: Date.now(), status: "present" },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Start Today Work Time",
    employee,
    clockinDetails, // return the created clockin details in the response
  });
});

exports.startBreak = catchAsyncError(async (req, res, next) => {
  const employee = await Employee.findByIdAndUpdate(
    req.params.id,
    { breakStartTime: Date.now(), status: "onBreak" },
    { new: true }
  );
  res.status(200).json({
    success: true,
    message: "Start Break Time",
    employee,
  });
});

exports.stopBreak = catchAsyncError(async (req, res, next) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee.breakStartTime) {
    return next(new ErrorHandler("Break time not started yet", 400));
  }
  const totalBreakTimeInSeconds = Math.floor(
    (Date.now() - employee.breakStartTime) / 1000
  ); // Convert to seconds

  const hours = Math.floor(totalBreakTimeInSeconds / 3600);
  const minutes = Math.floor((totalBreakTimeInSeconds % 3600) / 60);
  const seconds = totalBreakTimeInSeconds % 60;

  const totalBreakTime = `${hours}h, ${minutes}m, ${seconds}s`;

  const updatedEmployee = await Employee.findByIdAndUpdate(
    req.params.id,
    {
      breakEndTime: Date.now(),
      afterBreakTime: Date.now(),
      totalBreakTime: totalBreakTime, // Convert to number
      status: "present",
    },
    { new: true }
  );
  res.status(200).json({
    success: true,
    message: "Your Break is Finished",
    employee: updatedEmployee,
  });
});

exports.clockOut = catchAsyncError(async (req, res, next) => {
  const employee = await Employee.findById(req.params.id);
  if (!employee) {
    return next(new ErrorHandler("Employee not found", 404));
  }
  if (!employee.clockInTime) {
    return next(new ErrorHandler("Clock in time not started yet", 400));
  }
  if (!employee.afterBreakTime) {
    return next(new ErrorHandler("Break time not ended yet", 400));
  }
  if (!req.body.notes) {
    return next(new ErrorHandler("Please provide notes for the day", 400));
  }

  // Get clockin details for the employee
  const clockinDetails = await ClockinDetails.findOne({
    employee: employee._id,
  });

  if (!clockinDetails) {
    return next(new ErrorHandler("Clockin details not found", 404));
  }

  const totalWorkTimeInSeconds = Math.floor(
    (Date.now() -
      clockinDetails.clockInTime -
      (employee.breakEndTime - employee.breakStartTime)) /
      1000
  ); // Convert to seconds

  const hours = Math.floor(totalWorkTimeInSeconds / 3600);
  const minutes = Math.floor((totalWorkTimeInSeconds % 3600) / 60);
  const seconds = totalWorkTimeInSeconds % 60;

  const totalWorkTime = `${hours}h, ${minutes}m, ${seconds}s`;

  const scheduleData = {
    date: new Date(),
    clockInTime: employee.clockInTime,
    breakStartTime: employee.breakStartTime,
    breakEndTime: employee.breakEndTime,
    afterBreakTime: employee.afterBreakTime,
    clockOutTime: Date.now(),
    updateClockinTime: clockinDetails.clockInTime,
    notes: req.body.notes,
    totalWorkTime,
    totalBreakTime: employee.totalBreakTime,
    status: "present",
    employeeId: employee._id,
  };
  await Schedule.create(scheduleData);

  // Remove clockin details
  await ClockinDetails.findOneAndRemove({ employee: employee._id });

  await Employee.findByIdAndUpdate(req.params.id, {
    clockInTime: null,
    breakStartTime: null,
    breakEndTime: null,
    afterBreakTime: null,
    clockOutTime: null,
    totalWorkTime: null,
    totalBreakTime: null,
    status: "absent",
  });
  res.status(200).json({
    success: true,
    message: "Work day ended successfully",
  });
});







