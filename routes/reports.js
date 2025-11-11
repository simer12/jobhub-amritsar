const express = require('express');
const router = express.Router();
const {
    getUserGrowthReport,
    getJobsReport,
    getApplicationsReport,
    getCompanyPerformanceReport,
    getPlatformOverviewReport
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected and require admin role
router.use(protect);
router.use(authorize('admin'));

// @route   GET /api/reports/user-growth
// @desc    Get user growth report
// @access  Private/Admin
router.get('/user-growth', getUserGrowthReport);

// @route   GET /api/reports/jobs
// @desc    Get jobs report
// @access  Private/Admin
router.get('/jobs', getJobsReport);

// @route   GET /api/reports/applications
// @desc    Get applications analytics report
// @access  Private/Admin
router.get('/applications', getApplicationsReport);

// @route   GET /api/reports/companies
// @desc    Get company performance report
// @access  Private/Admin
router.get('/companies', getCompanyPerformanceReport);

// @route   GET /api/reports/platform-overview
// @desc    Get platform overview report
// @access  Private/Admin
router.get('/platform-overview', getPlatformOverviewReport);

module.exports = router;
