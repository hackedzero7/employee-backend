const express = require('express');
const { isAuthenticated, autherizedAdmin } = require('../middlewares/auth');
const { getAllEmployeeSchedule } = require('../controllers/schedule');

const router = express.Router();


router.route('/schedule').get(isAuthenticated, autherizedAdmin, getAllEmployeeSchedule);

module.exports = router;