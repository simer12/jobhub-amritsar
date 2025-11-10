const { User, Job, Application } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
    try {
        const { role, search, status } = req.query;
        
        const where = {};
        
        // Filter by role
        if (role) {
            where.role = role;
        }
        
        // Filter by search
        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { companyName: { [Op.like]: `%${search}%` } }
            ];
        }
        
        // Filter by status
        if (status) {
            where.isActive = status === 'active';
        }
        
        const users = await User.findAll({
            where,
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']]
        });
        
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: error.message
        });
    }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        const { isVerified, isActive } = req.body;
        
        if (isVerified !== undefined) user.isVerified = isVerified;
        if (isActive !== undefined) user.isActive = isActive;
        
        await user.save();
        
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user',
            error: error.message
        });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        await user.destroy();
        
        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message
        });
    }
};

// @desc    Get all applications
// @route   GET /api/admin/applications
// @access  Private/Admin
exports.getAllApplications = async (req, res) => {
    try {
        const { status, search } = req.query;
        
        const where = {};
        
        if (status) {
            where.status = status;
        }
        
        const applications = await Application.findAll({
            where,
            order: [['createdAt', 'DESC']],
            limit: 100
        });
        
        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        console.error('Get all applications error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message
        });
    }
};

// @desc    Get all jobs
// @route   GET /api/admin/jobs
// @access  Private/Admin
exports.getAllJobs = async (req, res) => {
    try {
        const { status, search } = req.query;
        
        const where = {};
        
        if (status) {
            where.status = status;
        }
        
        if (search) {
            where[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { companyName: { [Op.like]: `%${search}%` } }
            ];
        }
        
        const jobs = await Job.findAll({
            where,
            order: [['createdAt', 'DESC']]
        });
        
        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });
    } catch (error) {
        console.error('Get all jobs error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching jobs',
            error: error.message
        });
    }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
    try {
        const totalUsers = await User.count();
        const totalJobSeekers = await User.count({ where: { role: 'jobseeker' } });
        const totalEmployers = await User.count({ where: { role: 'employer' } });
        const totalJobs = await Job.count();
        const activeJobs = await Job.count({ where: { status: 'active' } });
        const totalApplications = await Application.count();
        const pendingApplications = await Application.count({ where: { status: 'pending' } });
        
        res.status(200).json({
            success: true,
            data: {
                users: {
                    total: totalUsers,
                    jobSeekers: totalJobSeekers,
                    employers: totalEmployers
                },
                jobs: {
                    total: totalJobs,
                    active: activeJobs
                },
                applications: {
                    total: totalApplications,
                    pending: pendingApplications
                }
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching stats',
            error: error.message
        });
    }
};

module.exports = exports;
