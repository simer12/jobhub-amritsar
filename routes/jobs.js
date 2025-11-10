const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/jobs
// @desc    Get all jobs with filters
// @access  Public
router.get('/', jobController.getJobs);

// @route   GET /api/jobs/my-jobs
// @desc    Get employer's own jobs
// @access  Private (Employer only)
router.get('/my-jobs', protect, authorize('employer', 'admin'), jobController.getMyJobs);

// @route   GET /api/jobs/amritsar
// @desc    Get Amritsar specific jobs
// @access  Public
router.get('/amritsar', jobController.getAmritsarJobs);

// @route   GET /api/jobs/:id
// @desc    Get single job
// @access  Public
router.get('/:id', jobController.getJob);

// @route   POST /api/jobs
// @desc    Create new job
// @access  Private (Employer only)
router.post('/', protect, authorize('employer', 'admin'), jobController.createJob);

// @route   PUT /api/jobs/:id
// @desc    Update job
// @access  Private (Employer only - own jobs)
router.put('/:id', protect, authorize('employer', 'admin'), jobController.updateJob);

// @route   DELETE /api/jobs/:id
// @desc    Delete job
// @access  Private (Employer only - own jobs)
router.delete('/:id', protect, authorize('employer', 'admin'), jobController.deleteJob);

// @route   GET /api/jobs/search/advanced
// @desc    Advanced job search
// @access  Public
router.get('/search/advanced', jobController.advancedSearch);

// @route   POST /api/jobs/:id/save
// @desc    Save/bookmark a job
// @access  Private (Job seeker)
router.post('/:id/save', protect, authorize('jobseeker'), jobController.saveJob);

// @route   DELETE /api/jobs/:id/save
// @desc    Remove saved job
// @access  Private (Job seeker)
router.delete('/:id/save', protect, authorize('jobseeker'), jobController.removeSavedJob);

// @route   GET /api/jobs/saved/all
// @desc    Get all saved jobs
// @access  Private (Job seeker)
router.get('/saved/all', protect, authorize('jobseeker'), jobController.getSavedJobs);

module.exports = router;
