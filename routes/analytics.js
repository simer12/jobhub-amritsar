const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getUserAcquisition,
    getJobSuccessRate,
    getApplicationFunnel,
    getPlatformGrowth
} = require('../controllers/analyticsController');

// All routes require admin access
router.use(protect);
router.use(authorize('admin'));

router.get('/user-acquisition', getUserAcquisition);
router.get('/job-success-rate', getJobSuccessRate);
router.get('/application-funnel', getApplicationFunnel);
router.get('/platform-growth', getPlatformGrowth);

module.exports = router;
