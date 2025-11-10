const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   POST /api/applications/:jobId
// @desc    Apply for a job
// @access  Private (Job seeker)
router.post('/:jobId', 
    protect, 
    authorize('jobseeker'),
    upload.single('resume'),
    applicationController.applyForJob
);

// @route   GET /api/applications/my-applications
// @desc    Get user's applications
// @access  Private (Job seeker)
router.get('/my-applications', 
    protect, 
    authorize('jobseeker'),
    applicationController.getMyApplications
);

// @route   GET /api/applications/employer-applications
// @desc    Get employer's all applications
// @access  Private (Employer)
router.get('/employer-applications', 
    protect, 
    authorize('employer', 'admin'),
    applicationController.getEmployerApplications
);

// @route   GET /api/applications/job/:jobId
// @desc    Get all applications for a job
// @access  Private (Employer - own jobs)
router.get('/job/:jobId', 
    protect, 
    authorize('employer', 'admin'),
    applicationController.getJobApplications
);

// @route   GET /api/applications/:id
// @desc    Get single application
// @access  Private
router.get('/:id', 
    protect,
    applicationController.getApplication
);

// @route   PUT /api/applications/:id/status
// @desc    Update application status
// @access  Private (Employer)
router.put('/:id/status', 
    protect, 
    authorize('employer', 'admin'),
    applicationController.updateApplicationStatus
);

// @route   PUT /api/applications/:id/interview
// @desc    Schedule interview
// @access  Private (Employer)
router.put('/:id/interview', 
    protect, 
    authorize('employer', 'admin'),
    applicationController.scheduleInterview
);

// @route   DELETE /api/applications/:id
// @desc    Withdraw application
// @access  Private (Job seeker - own application)
router.delete('/:id', 
    protect, 
    authorize('jobseeker'),
    applicationController.withdrawApplication
);

// @route   POST /api/applications/:id/request-details
// @desc    Request access to applicant details
// @access  Private (Employer)
router.post('/:id/request-details', 
    protect, 
    authorize('employer'),
    applicationController.requestDetailsAccess
);

// @route   POST /api/applications/:id/grant-details
// @desc    Grant access to applicant details
// @access  Private (Admin only)
router.post('/:id/grant-details', 
    protect, 
    authorize('admin'),
    applicationController.grantDetailsAccess
);

// @route   GET /api/applications/access-requests
// @desc    Get pending access requests
// @access  Private (Admin only)
router.get('/access-requests', 
    protect, 
    authorize('admin'),
    applicationController.getPendingAccessRequests
);

module.exports = router;
