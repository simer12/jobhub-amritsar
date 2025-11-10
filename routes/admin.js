const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
    getAllApplications,
    getAllJobs,
    deleteJob,
    getStats
} = require('../controllers/adminController');

// Protect all admin routes
router.use(protect);
router.use(authorize('admin'));

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Applications management
router.get('/applications', getAllApplications);

// Jobs management
router.get('/jobs', getAllJobs);
router.delete('/jobs/:id', deleteJob);

// Dashboard stats
router.get('/stats', getStats);

module.exports = router;
