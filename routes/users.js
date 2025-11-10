const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, userController.getProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, userController.updateProfile);

// @route   POST /api/users/upload-resume
// @desc    Upload resume
// @access  Private (Job seeker)
router.post('/upload-resume', 
    protect, 
    authorize('jobseeker'),
    upload.single('resume'),
    userController.uploadResume
);

// @route   POST /api/users/upload-profile-picture
// @desc    Upload profile picture
// @access  Private
router.post('/upload-profile-picture', 
    protect,
    upload.single('profilePicture'),
    userController.uploadProfilePicture
);

// @route   GET /api/users/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', protect, userController.getDashboard);

module.exports = router;
