const { User, Job, Application } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database').sequelize;

// @desc    Get user acquisition analytics
// @route   GET /api/analytics/user-acquisition
// @access  Private/Admin
exports.getUserAcquisition = async (req, res) => {
    try {
        const { days = 30 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        // Get daily user registrations
        const users = await User.findAll({
            where: {
                createdAt: {
                    [Op.gte]: startDate
                }
            },
            attributes: [
                [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                'role'
            ],
            group: [sequelize.fn('DATE', sequelize.col('createdAt')), 'role'],
            order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']],
            raw: true
        });

        // Format data by role
        const dailyData = {};
        users.forEach(item => {
            if (!dailyData[item.date]) {
                dailyData[item.date] = { jobseekers: 0, employers: 0 };
            }
            if (item.role === 'jobseeker') {
                dailyData[item.date].jobseekers = parseInt(item.count);
            } else if (item.role === 'employer') {
                dailyData[item.date].employers = parseInt(item.count);
            }
        });

        // Fill in missing dates with 0
        const dates = [];
        const jobseekers = [];
        const employers = [];
        
        for (let i = parseInt(days) - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            dates.push(dateStr);
            jobseekers.push(dailyData[dateStr]?.jobseekers || 0);
            employers.push(dailyData[dateStr]?.employers || 0);
        }

        res.status(200).json({
            success: true,
            data: {
                labels: dates,
                datasets: [
                    {
                        label: 'Job Seekers',
                        data: jobseekers
                    },
                    {
                        label: 'Employers',
                        data: employers
                    }
                ]
            }
        });

    } catch (error) {
        console.error('User acquisition analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user acquisition analytics',
            error: error.message
        });
    }
};

// @desc    Get job success rate analytics
// @route   GET /api/analytics/job-success-rate
// @access  Private/Admin
exports.getJobSuccessRate = async (req, res) => {
    try {
        const { days = 30 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        // Get application statuses
        const applications = await Application.findAll({
            where: {
                createdAt: {
                    [Op.gte]: startDate
                }
            },
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['status'],
            raw: true
        });

        const statusMap = {
            'pending': 0,
            'reviewing': 0,
            'shortlisted': 0,
            'interview_scheduled': 0,
            'accepted': 0,
            'rejected': 0
        };

        applications.forEach(app => {
            statusMap[app.status] = parseInt(app.count);
        });

        res.status(200).json({
            success: true,
            data: {
                labels: Object.keys(statusMap).map(key => 
                    key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
                ),
                values: Object.values(statusMap)
            }
        });

    } catch (error) {
        console.error('Job success rate analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching job success rate analytics',
            error: error.message
        });
    }
};

// @desc    Get application funnel analytics
// @route   GET /api/analytics/application-funnel
// @access  Private/Admin
exports.getApplicationFunnel = async (req, res) => {
    try {
        const { days = 30 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        // Total jobs posted
        const totalJobs = await Job.count({
            where: {
                createdAt: {
                    [Op.gte]: startDate
                }
            }
        });

        // Jobs with applications
        const jobsWithApps = await Job.count({
            where: {
                createdAt: {
                    [Op.gte]: startDate
                },
                applicationCount: {
                    [Op.gt]: 0
                }
            }
        });

        // Total applications
        const totalApps = await Application.count({
            where: {
                createdAt: {
                    [Op.gte]: startDate
                }
            }
        });

        // Shortlisted applications
        const shortlisted = await Application.count({
            where: {
                createdAt: {
                    [Op.gte]: startDate
                },
                status: 'shortlisted'
            }
        });

        // Interview scheduled
        const interviews = await Application.count({
            where: {
                createdAt: {
                    [Op.gte]: startDate
                },
                status: 'interview_scheduled'
            }
        });

        // Accepted applications
        const accepted = await Application.count({
            where: {
                createdAt: {
                    [Op.gte]: startDate
                },
                status: 'accepted'
            }
        });

        res.status(200).json({
            success: true,
            data: {
                labels: ['Jobs Posted', 'Jobs with Apps', 'Total Applications', 'Shortlisted', 'Interviews', 'Accepted'],
                values: [totalJobs, jobsWithApps, totalApps, shortlisted, interviews, accepted]
            }
        });

    } catch (error) {
        console.error('Application funnel analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching application funnel analytics',
            error: error.message
        });
    }
};

// @desc    Get platform growth analytics
// @route   GET /api/analytics/platform-growth
// @access  Private/Admin
exports.getPlatformGrowth = async (req, res) => {
    try {
        const { days = 30 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));

        // Get daily metrics
        const dailyMetrics = [];
        
        for (let i = parseInt(days) - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);
            
            // Count users registered on this day
            const users = await User.count({
                where: {
                    createdAt: {
                        [Op.gte]: date,
                        [Op.lt]: nextDate
                    }
                }
            });
            
            // Count jobs posted on this day
            const jobs = await Job.count({
                where: {
                    createdAt: {
                        [Op.gte]: date,
                        [Op.lt]: nextDate
                    }
                }
            });
            
            // Count applications on this day
            const applications = await Application.count({
                where: {
                    createdAt: {
                        [Op.gte]: date,
                        [Op.lt]: nextDate
                    }
                }
            });
            
            dailyMetrics.push({
                date: dateStr,
                users,
                jobs,
                applications
            });
        }

        res.status(200).json({
            success: true,
            data: {
                labels: dailyMetrics.map(m => m.date),
                datasets: [
                    {
                        label: 'New Users',
                        data: dailyMetrics.map(m => m.users)
                    },
                    {
                        label: 'Jobs Posted',
                        data: dailyMetrics.map(m => m.jobs)
                    },
                    {
                        label: 'Applications',
                        data: dailyMetrics.map(m => m.applications)
                    }
                ]
            }
        });

    } catch (error) {
        console.error('Platform growth analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching platform growth analytics',
            error: error.message
        });
    }
};
