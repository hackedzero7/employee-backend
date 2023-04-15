const express = require('express');
const { registerEmployee, login, logout, getMyProfile, clockIn, startBreak, stopBreak, clockOut, getAllEmployees, updateEmployee, deleteEmployee, getEmployeeDetails, getUpcomingBirthdays, updateProfilePicture } = require('../controllers/employee');
const { autherizedAdmin, employeeIPMiddleware, isAuthenticated } = require('../middlewares/auth');
const singleUpload = require('../middlewares/multer');
const router = express.Router();

router.route('/register').post(isAuthenticated, autherizedAdmin ,singleUpload, registerEmployee);
router.route('/login').post(login);
router.route('/me').get(isAuthenticated, getMyProfile);
router.route('/all/employees').get(isAuthenticated, autherizedAdmin, getAllEmployees);
router.route('/employee/:id').get(isAuthenticated, autherizedAdmin, getEmployeeDetails)
.put(isAuthenticated, autherizedAdmin,singleUpload, updateEmployee)
.delete(isAuthenticated, autherizedAdmin,singleUpload, deleteEmployee);
router.route('/updateprofilepicture').put(isAuthenticated, singleUpload, updateProfilePicture);
router.route('/clockin/:id').post(isAuthenticated, clockIn);
router.route('/startbreak/:id').post(isAuthenticated, startBreak);
router.route('/stopbreak/:id').post(isAuthenticated, stopBreak);
router.route('/clockout/:id').post(isAuthenticated, clockOut);
router.route('/upcoming-birthdays').get(isAuthenticated, autherizedAdmin, getUpcomingBirthdays);
router.route('/logout').get(logout);

module.exports = router;