const { User, Job, Application } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

// @desc    Generate User Growth Report
// @route   GET /api/reports/user-growth
// @access  Private/Admin
exports.getUserGrowthReport = async (req, res) => {
    try {
        const { startDate, endDate, period = '30' } = req.query;
        
        const daysAgo = parseInt(period) || 30;
        const dateFrom = startDate ? new Date(startDate) : new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
        const dateTo = endDate ? new Date(endDate) : new Date();
        
        // Get users grouped by date
        const users = await User.findAll({
            where: {
                createdAt: {
                    [Op.between]: [dateFrom, dateTo]
                }
            },
            attributes: [
                [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
                'role',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: [sequelize.fn('DATE', sequelize.col('createdAt')), 'role'],
            order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
        });
        
        // Get totals by role
        const totalsByRole = await User.findAll({
            where: {
                createdAt: {
                    [Op.between]: [dateFrom, dateTo]
                }
            },
            attributes: [
                'role',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['role']
        });
        
        const totalUsers = await User.count({
            where: {
                createdAt: {
                    [Op.between]: [dateFrom, dateTo]
                }
            }
        });
        
        res.json({
            success: true,
            data: {
                period: `${daysAgo} days`,
                dateRange: { from: dateFrom, to: dateTo },
                totalUsers,
                usersByRole: totalsByRole,
                dailyGrowth: users
            }
        });
    } catch (error) {
        console.error('User growth report error:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating user growth report'
        });
    }
};

// @desc    Generate Jobs Report
// @route   GET /api/reports/jobs
// @access  Private/Admin
exports.getJobsReport = async (req, res) => {
    try {
        const { startDate, endDate, period = '30' } = req.query;
        
        const daysAgo = parseInt(period) || 30;
        const dateFrom = startDate ? new Date(startDate) : new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
        const dateTo = endDate ? new Date(endDate) : new Date();
        
        // Total jobs posted
        const totalJobs = await Job.count({
            where: {
                createdAt: {
                    [Op.between]: [dateFrom, dateTo]
                }
            }
        });
        
        // Jobs by type
        const jobsByType = await Job.findAll({
            where: {
                createdAt: {
                    [Op.between]: [dateFrom, dateTo]
                }
            },
            attributes: [
                'jobType',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['jobType']
        });
        
        // Jobs by work mode
        const jobsByWorkMode = await Job.findAll({
            where: {
                createdAt: {
                    [Op.between]: [dateFrom, dateTo]
                }
            },
            attributes: [
                'workMode',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['workMode']
        });
        
        // Top companies by job postings
        const topCompanies = await Job.findAll({
            where: {
                createdAt: {
                    [Op.between]: [dateFrom, dateTo]
                }
            },
            attributes: [
                'companyName',
                [sequelize.fn('COUNT', sequelize.col('id')), 'jobCount']
            ],
            group: ['companyName'],
            order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
            limit: 10
        });
        
        // Average salary
        const avgSalary = await Job.findOne({
            attributes: [
                [sequelize.fn('AVG', sequelize.col('salary')), 'avgSalary']
            ]
        });
        
        res.json({
            success: true,
            data: {
                period: `${daysAgo} days`,
                dateRange: { from: dateFrom, to: dateTo },
                totalJobs,
                jobsByType,
                jobsByWorkMode,
                topCompanies,
                averageSalary: avgSalary.dataValues.avgSalary || 0
            }
        });
    } catch (error) {
        console.error('Jobs report error:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating jobs report'
        });
    }
};

// @desc    Generate Application Analytics Report
// @route   GET /api/reports/applications
// @access  Private/Admin
exports.getApplicationsReport = async (req, res) => {
    try {
        const { startDate, endDate, period = '30' } = req.query;
        
        const daysAgo = parseInt(period) || 30;
        const dateFrom = startDate ? new Date(startDate) : new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
        const dateTo = endDate ? new Date(endDate) : new Date();
        
        // Total applications
        const totalApplications = await Application.count({
            where: {
                createdAt: {
                    [Op.between]: [dateFrom, dateTo]
                }
            }
        });
        
        // Applications by status
        const applicationsByStatus = await Application.findAll({
            where: {
                createdAt: {
                    [Op.between]: [dateFrom, dateTo]
                }
            },
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['status']
        });
        
        // Daily applications
        const dailyApplications = await Application.findAll({
            where: {
                createdAt: {
                    [Op.between]: [dateFrom, dateTo]
                }
            },
            attributes: [
                [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
            order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
        });
        
        // Conversion rates
        const hired = await Application.count({
            where: {
                status: 'hired',
                createdAt: {
                    [Op.between]: [dateFrom, dateTo]
                }
            }
        });
        
        const shortlisted = await Application.count({
            where: {
                status: 'shortlisted',
                createdAt: {
                    [Op.between]: [dateFrom, dateTo]
                }
            }
        });
        
        const rejected = await Application.count({
            where: {
                status: 'rejected',
                createdAt: {
                    [Op.between]: [dateFrom, dateTo]
                }
            }
        });
        
        const conversionRate = totalApplications > 0 
            ? ((hired / totalApplications) * 100).toFixed(2) 
            : 0;
        
        const shortlistRate = totalApplications > 0 
            ? ((shortlisted / totalApplications) * 100).toFixed(2) 
            : 0;
        
        const rejectionRate = totalApplications > 0 
            ? ((rejected / totalApplications) * 100).toFixed(2) 
            : 0;
        
        res.json({
            success: true,
            data: {
                period: `${daysAgo} days`,
                dateRange: { from: dateFrom, to: dateTo },
                totalApplications,
                applicationsByStatus,
                dailyApplications,
                metrics: {
                    hired,
                    shortlisted,
                    rejected,
                    conversionRate: parseFloat(conversionRate),
                    shortlistRate: parseFloat(shortlistRate),
                    rejectionRate: parseFloat(rejectionRate)
                }
            }
        });
    } catch (error) {
        console.error('Applications report error:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating applications report'
        });
    }
};

// @desc    Generate Company Performance Report
// @route   GET /api/reports/companies
// @access  Private/Admin
exports.getCompanyPerformanceReport = async (req, res) => {
    try {
        const { period = '30' } = req.query;
        
        const daysAgo = parseInt(period) || 30;
        const dateFrom = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
        
        // Get companies with their job and application counts
        const companies = await User.findAll({
            where: {
                role: 'employer'
            },
            attributes: [
                'id',
                'name',
                'email',
                'companyName',
                'createdAt'
            ],
            include: [
                {
                    model: Job,
                    as: 'jobs',
                    attributes: ['id', 'title', 'createdAt'],
                    where: {
                        createdAt: {
                            [Op.gte]: dateFrom
                        }
                    },
                    required: false,
                    include: [
                        {
                            model: Application,
                            as: 'applications',
                            attributes: ['id', 'status']
                        }
                    ]
                }
            ]
        });
        
        // Format company data
        const companyStats = companies.map(company => {
            const jobs = company.jobs || [];
            const totalJobs = jobs.length;
            const totalApplications = jobs.reduce((sum, job) => sum + (job.applications?.length || 0), 0);
            const hiredCount = jobs.reduce((sum, job) => {
                return sum + (job.applications?.filter(app => app.status === 'hired').length || 0);
            }, 0);
            
            return {
                id: company.id,
                companyName: company.companyName || company.name,
                email: company.email,
                memberSince: company.createdAt,
                totalJobs,
                totalApplications,
                hiredCount,
                avgApplicationsPerJob: totalJobs > 0 ? (totalApplications / totalJobs).toFixed(1) : 0
            };
        }).sort((a, b) => b.totalApplications - a.totalApplications);
        
        res.json({
            success: true,
            data: {
                period: `${daysAgo} days`,
                totalCompanies: companies.length,
                companies: companyStats.slice(0, 20) // Top 20
            }
        });
    } catch (error) {
        console.error('Company performance report error:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating company performance report'
        });
    }
};

// @desc    Generate Platform Overview Report
// @route   GET /api/reports/platform-overview
// @access  Private/Admin
exports.getPlatformOverviewReport = async (req, res) => {
    try {
        const { period = '30' } = req.query;
        
        const daysAgo = parseInt(period) || 30;
        const dateFrom = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
        
        // Total counts
        const totalUsers = await User.count();
        const totalJobs = await Job.count();
        const totalApplications = await Application.count();
        
        // Recent counts
        const newUsers = await User.count({
            where: { createdAt: { [Op.gte]: dateFrom } }
        });
        
        const newJobs = await Job.count({
            where: { createdAt: { [Op.gte]: dateFrom } }
        });
        
        const newApplications = await Application.count({
            where: { createdAt: { [Op.gte]: dateFrom } }
        });
        
        // User breakdown
        const usersByRole = await User.findAll({
            attributes: [
                'role',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['role']
        });
        
        // Active jobs (not expired)
        const activeJobs = await Job.count({
            where: {
                [Op.or]: [
                    { expiryDate: null },
                    { expiryDate: { [Op.gt]: new Date() } }
                ]
            }
        });
        
        // Success metrics
        const hiredApplications = await Application.count({
            where: { status: 'hired' }
        });
        
        const successRate = totalApplications > 0 
            ? ((hiredApplications / totalApplications) * 100).toFixed(2)
            : 0;
        
        res.json({
            success: true,
            data: {
                period: `${daysAgo} days`,
                overview: {
                    totalUsers,
                    totalJobs,
                    totalApplications,
                    activeJobs,
                    successRate: parseFloat(successRate)
                },
                recentActivity: {
                    newUsers,
                    newJobs,
                    newApplications
                },
                usersByRole,
                metrics: {
                    avgApplicationsPerJob: totalJobs > 0 ? (totalApplications / totalJobs).toFixed(1) : 0,
                    avgJobsPerCompany: usersByRole.find(u => u.role === 'employer')?.count > 0 
                        ? (totalJobs / usersByRole.find(u => u.role === 'employer').count).toFixed(1) 
                        : 0
                }
            }
        });
    } catch (error) {
        console.error('Platform overview report error:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating platform overview report'
        });
    }
};
