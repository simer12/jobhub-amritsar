const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/dashboard/employer
// @desc    Get employer dashboard stats
// @access  Private (Employer)
router.get('/employer', 
    protect, 
    authorize('employer', 'admin'),
    dashboardController.getEmployerDashboard
);

// @route   GET /api/dashboard/jobseeker
// @desc    Get job seeker dashboard stats
// @access  Private (Job seeker)
router.get('/jobseeker', 
    protect, 
    authorize('jobseeker'),
    dashboardController.getJobSeekerDashboard
);

// @route   GET /api/dashboard/analytics
// @desc    Get analytics data
// @access  Private (Employer)
router.get('/analytics', 
    protect, 
    authorize('employer', 'admin'),
    dashboardController.getAnalytics
);

module.exports = router;
