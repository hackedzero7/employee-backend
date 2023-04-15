const express = require('express');
const { createLeaveReaquest, getallleaveRequestforAdmin, updateLeaveRequestStatus } = require('../controllers/leave');
const { isAuthenticated, autherizedAdmin } = require('../middlewares/auth');
const router = express.Router();

router.route('/leaverequest').post(isAuthenticated, createLeaveReaquest);
router.route('/getallleaves').get(isAuthenticated, autherizedAdmin, getallleaveRequestforAdmin);
router.route('/leave/:id').put(isAuthenticated, autherizedAdmin, updateLeaveRequestStatus);

module.exports = router;