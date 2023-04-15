const express = require('express');
const { isAuthenticated, autherizedAdmin } = require('../middlewares/auth');
const { getClockinDetails, updateClockinTime } = require('../controllers/clockinDetails');
const router = express.Router();

router.route('/getclockindetails').get(isAuthenticated, autherizedAdmin, getClockinDetails);
router.route('/clockindetails/update/:id').put(isAuthenticated, autherizedAdmin, updateClockinTime);

module.exports = router;