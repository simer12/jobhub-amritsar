const express = require('express');
const router = express.Router();
const { 
    getJobSeekerNotifications,
    getRecruiterNotifications,
    getAdminNotifications
} = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/notifications/jobseeker
// @desc    Get notifications for job seeker
// @access  Private (Job Seeker)
router.get('/jobseeker', protect, authorize('jobseeker'), getJobSeekerNotifications);

// @route   GET /api/notifications/recruiter
// @desc    Get notifications for recruiter
// @access  Private (Recruiter)
router.get('/recruiter', protect, authorize('employer'), getRecruiterNotifications);

// @route   GET /api/notifications/admin
// @desc    Get notifications for admin
// @access  Private (Admin)
router.get('/admin', protect, authorize('admin'), getAdminNotifications);

module.exports = router;
