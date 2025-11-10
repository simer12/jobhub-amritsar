const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('savedJobs')
            .populate('appliedJobs');

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const allowedFields = [
            'name', 'phone', 'bio', 'skills', 'experience', 'education',
            'currentLocation', 'preferredLocations', 'preferredJobType',
            'languagesKnown', 'localArea', 'expectedSalary', 'companyName',
            'companySize', 'companyType', 'companyWebsite', 'companyDescription'
        ];

        const updates = {};
        Object.keys(req.body).forEach(key => {
            if (allowedFields.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            data: user,
            message: 'Profile updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};

// @desc    Upload resume
// @route   POST /api/users/upload-resume
// @access  Private (Job seeker)
exports.uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a file'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { resume: req.file.path },
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: {
                resume: user.resume
            },
            message: 'Resume uploaded successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error uploading resume',
            error: error.message
        });
    }
};

// @desc    Upload profile picture
// @route   POST /api/users/upload-profile-picture
// @access  Private
exports.uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a file'
            });
        }

        const updateField = req.user.role === 'employer' ? 
            { companyLogo: req.file.path } : 
            { profilePicture: req.file.path };

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updateField,
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: {
                profilePicture: user.profilePicture,
                companyLogo: user.companyLogo
            },
            message: 'Picture uploaded successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error uploading picture',
            error: error.message
        });
    }
};

// @desc    Get user dashboard data
// @route   GET /api/users/dashboard
// @access  Private
exports.getDashboard = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .populate('savedJobs')
            .populate('appliedJobs');

        const Application = require('../models/Application');
        const Job = require('../models/Job');

        let dashboardData = {
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                isPremium: user.isPremium
            }
        };

        if (user.role === 'jobseeker') {
            const applications = await Application.find({ jobSeeker: user._id })
                .populate('job', 'title companyName');

            dashboardData.applications = applications;
            dashboardData.savedJobs = user.savedJobs;
            dashboardData.stats = {
                totalApplications: applications.length,
                pendingApplications: applications.filter(a => a.status === 'pending').length,
                shortlisted: applications.filter(a => a.status === 'shortlisted').length,
                rejected: applications.filter(a => a.status === 'rejected').length,
                savedJobs: user.savedJobs.length
            };
        } else if (user.role === 'employer') {
            const jobs = await Job.find({ company: user._id });
            const applications = await Application.find({ employer: user._id });

            dashboardData.jobs = jobs;
            dashboardData.applications = applications;
            dashboardData.stats = {
                totalJobs: jobs.length,
                activeJobs: jobs.filter(j => j.status === 'active').length,
                totalApplications: applications.length,
                newApplications: applications.filter(a => !a.isRead).length,
                shortlisted: applications.filter(a => a.status === 'shortlisted').length
            };
        }

        res.status(200).json({
            success: true,
            data: dashboardData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard data',
            error: error.message
        });
    }
};
