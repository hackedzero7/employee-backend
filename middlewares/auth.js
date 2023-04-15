const { catchAsyncError } = require("./catchAsyncError");
const jwt = require('jsonwebtoken');
const ErrorHandler = require("../utils/errorHandler");
const Employee = require("../models/Employee");
const axios = require('axios');
/**function realted to user is authenticated or not for protecting route */
exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;
    if(!token){
        return next(new ErrorHandler("Please Login First"), 401)
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.employee = await Employee.findById(decoded._id);
    next();
})

/**function for admin access protecting routes */

exports.autherizedAdmin = (req, res, next) => {
    if(req.employee.role !== "admin"){
        return next(new ErrorHandler(`${req.employee.role} is not allow to access this resource.`))
    }
    next();
}


exports.employeeIPMiddleware = async (req, res, next) => {
    let employeeIP;

    // Fetch the client IP address from the API
    try {
      const response = await axios.get('https://api.ipify.org/?format=json');
      employeeIP = response.data.ip;
    } catch (error) {
      console.error(`Error getting IP address: ${error.message}`);
    }

    const employee = await Employee.findOne({ email: req.body.email });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    if (employee.role === 'admin') {
      return next(); // allow admin to access from any IP address
    }

    console.log(`employeeIP: ${employeeIP}, employee.ipRestrictions: ${employee.ipRestrictions}`);

    if (!employee.ipRestrictions.includes(employeeIP)) {
      return res.status(403).json({ error: 'Access denied from this IP address' });
    }

    next();
};

  
  

  

  
  
  