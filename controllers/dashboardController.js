const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');

// @desc    Get employer dashboard
// @route   GET /api/dashboard/employer
// @access  Private (Employer)
exports.getEmployerDashboard = async (req, res) => {
    try {
        // Get all jobs posted by employer
        const jobs = await Job.find({ company: req.user.id });
        
        // Get all applications
        const applications = await Application.find({ employer: req.user.id })
            .populate('jobSeeker', 'name email phone')
            .populate('job', 'title')
            .sort('-createdAt');

        // Calculate stats
        const stats = {
            totalJobs: jobs.length,
            activeJobs: jobs.filter(j => j.status === 'active').length,
            closedJobs: jobs.filter(j => j.status === 'closed').length,
            totalApplications: applications.length,
            newApplications: applications.filter(a => !a.isRead).length,
            pendingApplications: applications.filter(a => a.status === 'pending').length,
            shortlisted: applications.filter(a => a.status === 'shortlisted').length,
            interviewed: applications.filter(a => a.status === 'interview_scheduled').length,
            hired: applications.filter(a => a.status === 'hired').length,
            rejected: applications.filter(a => a.status === 'rejected').length,
            totalViews: jobs.reduce((sum, job) => sum + job.views, 0)
        };

        // Recent applications
        const recentApplications = applications.slice(0, 10);

        res.status(200).json({
            success: true,
            data: {
                stats,
                jobs: jobs.slice(0, 5), // Latest 5 jobs
                recentApplications
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching employer dashboard',
            error: error.message
        });
    }
};

// @desc    Get job seeker dashboard
// @route   GET /api/dashboard/jobseeker
// @access  Private (Job seeker)
exports.getJobSeekerDashboard = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        // Get all applications
        const applications = await Application.findAll({
            where: { userId: req.user.id },
            include: [{
                model: Job,
                attributes: ['title', 'companyName', 'location', 'salary']
            }],
            order: [['createdAt', 'DESC']]
        });

        // Calculate stats
        const stats = {
            totalApplications: applications.length,
            pendingApplications: applications.filter(a => a.status === 'pending').length,
            reviewing: applications.filter(a => a.status === 'reviewing').length,
            shortlisted: applications.filter(a => a.status === 'shortlisted').length,
            interviewed: applications.filter(a => a.status === 'interview' || a.status === 'interview_scheduled').length,
            rejected: applications.filter(a => a.status === 'rejected').length,
            accepted: applications.filter(a => a.status === 'accepted').length,
            savedJobs: (user.savedJobs || []).length,
            profileViews: user.profileViews || 0
        };

        // Recent jobs
        const recentJobs = await Job.findAll({
            where: { status: 'active' },
            order: [['createdAt', 'DESC']],
            limit: 10,
            include: [{
                model: User,
                attributes: ['companyName']
            }]
        });

        // Recommended jobs (simple matching based on skills and location)
        let recommendedJobs = [];
        if (user.skills && user.skills.length > 0) {
            recommendedJobs = await Job.findAll({
                where: { 
                    status: 'active'
                },
                order: [['createdAt', 'DESC']],
                limit: 5,
                include: [{
                    model: User,
                    attributes: ['companyName']
                }]
            });
        }

        res.status(200).json({
            success: true,
            data: {
                stats,
                applications: applications.slice(0, 10),
                savedJobs: user.savedJobs,
                recentJobs,
                recommendedJobs
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching job seeker dashboard',
            error: error.message
        });
    }
};

// @desc    Get analytics
// @route   GET /api/dashboard/analytics
// @access  Private (Employer)
exports.getAnalytics = async (req, res) => {
    try {
        const { period = '30' } = req.query; // days
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(period));

        const jobs = await Job.find({ 
            company: req.user.id,
            createdAt: { $gte: startDate }
        });

        const applications = await Application.find({ 
            employer: req.user.id,
            createdAt: { $gte: startDate }
        });

        // Group applications by date
        const applicationsByDate = {};
        applications.forEach(app => {
            const date = app.createdAt.toISOString().split('T')[0];
            applicationsByDate[date] = (applicationsByDate[date] || 0) + 1;
        });

        // Group by status
        const applicationsByStatus = {
            pending: applications.filter(a => a.status === 'pending').length,
            reviewing: applications.filter(a => a.status === 'reviewing').length,
            shortlisted: applications.filter(a => a.status === 'shortlisted').length,
            rejected: applications.filter(a => a.status === 'rejected').length,
            interview_scheduled: applications.filter(a => a.status === 'interview_scheduled').length,
            hired: applications.filter(a => a.status === 'hired').length
        };

        // Top performing jobs
        const topJobs = jobs
            .sort((a, b) => b.totalApplications - a.totalApplications)
            .slice(0, 5)
            .map(job => ({
                title: job.title,
                applications: job.totalApplications,
                views: job.views
            }));

        res.status(200).json({
            success: true,
            data: {
                period,
                applicationsByDate,
                applicationsByStatus,
                topJobs,
                totalApplications: applications.length,
                totalJobs: jobs.length
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching analytics',
            error: error.message
        });
    }
};
