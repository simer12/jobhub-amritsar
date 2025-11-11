const { Application, Job, User } = require('../models');
const { Op } = require('sequelize');

// @desc    Get notifications for job seeker
// @route   GET /api/notifications/jobseeker
// @access  Private (Job Seeker)
exports.getJobSeekerNotifications = async (req, res) => {
    try {
        const notifications = [];
        const userId = req.user.id;

        // Get recent application status updates for this job seeker
        const applications = await Application.findAll({
            where: {
                applicantId: userId,
                updatedAt: {
                    [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
                }
            },
            include: [{
                model: Job,
                as: 'job',
                attributes: ['title']
            }],
            order: [['updatedAt', 'DESC']],
            limit: 10
        });

        // Create notifications based on application status
        applications.forEach(app => {
            let icon = 'fa-check-circle';
            let color = 'blue';
            let title = 'Application Update';
            let message = '';

            // Map internal statuses to friendly notifications
            const jobTitle = app.job?.title || 'Unknown Job';
            switch (app.status) {
                case 'hired':
                    icon = 'fa-check-circle';
                    color = 'green';
                    title = 'Application Accepted';
                    message = `Your application for "${jobTitle}" has been accepted!`;
                    break;
                case 'rejected':
                    icon = 'fa-times-circle';
                    color = 'red';
                    title = 'Application Update';
                    message = `Status changed for "${jobTitle}"`;
                    break;
                case 'shortlisted':
                    icon = 'fa-star';
                    color = 'yellow';
                    title = 'Application Shortlisted';
                    message = `You've been shortlisted for "${jobTitle}"`;
                    break;
                case 'interview_scheduled':
                    icon = 'fa-comment';
                    color = 'purple';
                    title = 'Interview Scheduled';
                    message = `Interview scheduled for "${jobTitle}"`;
                    break;
                case 'reviewing':
                case 'pending':
                default:
                    icon = 'fa-file-alt';
                    color = 'blue';
                    title = 'Application Update';
                    message = `Application updated for "${jobTitle}"`;
            }

            notifications.push({
                id: app.id,
                icon,
                color,
                title,
                message,
                time: app.updatedAt,
                unread: ['hired', 'shortlisted', 'interview_scheduled', 'rejected'].includes(app.status)
            });
        });

        // Get new jobs matching profile (all recent jobs)
        const recentJobs = await Job.findAll({
            where: {
                createdAt: {
                    [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
                }
            },
            limit: 5
        });

        if (recentJobs.length > 0) {
            notifications.push({
                id: `jobs-${Date.now()}`,
                icon: 'fa-briefcase',
                color: 'green',
                title: 'New Job Matches',
                message: `${recentJobs.length} new jobs posted today!`,
                time: recentJobs[0].createdAt,
                unread: true
            });
        }

        // Sort by time (most recent first)
        notifications.sort((a, b) => new Date(b.time) - new Date(a.time));

        res.json({
            success: true,
            count: notifications.length,
            unreadCount: notifications.filter(n => n.unread).length,
            data: notifications
        });

    } catch (error) {
        console.error('Error fetching jobseeker notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching notifications'
        });
    }
};

// @desc    Get notifications for recruiter
// @route   GET /api/notifications/recruiter
// @access  Private (Recruiter)
exports.getRecruiterNotifications = async (req, res) => {
    try {
        const notifications = [];
        const recruiterId = req.user.id;

        // Get recruiter's jobs (companyId on Job)
        const recruiterJobs = await Job.findAll({
            where: { companyId: recruiterId },
            attributes: ['id', 'title', 'expiryDate']
        });

        const jobIds = recruiterJobs.map(job => job.id);

        // Get recent applications
        const recentApplications = await Application.findAll({
            where: {
                jobId: jobIds,
                createdAt: {
                    [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
                }
            },
            include: [{
                model: Job,
                as: 'job',
                attributes: ['title']
            }, {
                model: User,
                as: 'applicant',
                attributes: ['name']
            }],
            order: [['createdAt', 'DESC']],
            limit: 10
        });

        // Create notifications for new applications
        recentApplications.forEach(app => {
            const isNew = new Date() - new Date(app.createdAt) < 24 * 60 * 60 * 1000; // Less than 24 hours
            
            notifications.push({
                id: app.id,
                icon: 'fa-user-check',
                color: 'blue',
                title: 'New Application',
                message: `${app.applicant?.name || 'Someone'} applied for "${app.job?.title || 'Unknown Job'}"`,
                time: app.createdAt,
                unread: isNew
            });
        });

        // Check for expiring jobs
        const expiringJobs = recruiterJobs.filter(job => {
            if (!job.expiryDate) return false;
            const daysUntilExpiry = Math.ceil((new Date(job.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
            return daysUntilExpiry > 0 && daysUntilExpiry <= 7;
        });

        expiringJobs.forEach(job => {
            const daysUntilExpiry = Math.ceil((new Date(job.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
            notifications.push({
                id: `expire-${job.id}`,
                icon: 'fa-clock',
                color: 'yellow',
                title: 'Job Expiring Soon',
                message: `"${job.title}" expires in ${daysUntilExpiry} day${daysUntilExpiry > 1 ? 's' : ''}`,
                time: job.expiryDate || new Date(),
                unread: true
            });
        });

        // Get application count summary
        const applicationsByJob = {};
        recentApplications.forEach(app => {
            const jobTitle = app.job?.title || 'Unknown Job';
            applicationsByJob[jobTitle] = (applicationsByJob[jobTitle] || 0) + 1;
        });

        Object.entries(applicationsByJob).forEach(([jobTitle, count]) => {
            if (count >= 3) {
                notifications.push({
                    id: `summary-${jobTitle}`,
                    icon: 'fa-file-alt',
                    color: 'green',
                    title: 'Application Received',
                    message: `${count} applications received for "${jobTitle}"`,
                    time: new Date(),
                    unread: true
                });
            }
        });

        // Sort by time (most recent first)
        notifications.sort((a, b) => new Date(b.time) - new Date(a.time));

        // Remove duplicates and limit
        const uniqueNotifications = notifications.slice(0, 15);

        res.json({
            success: true,
            count: uniqueNotifications.length,
            unreadCount: uniqueNotifications.filter(n => n.unread).length,
            data: uniqueNotifications
        });

    } catch (error) {
        console.error('Error fetching recruiter notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching notifications'
        });
    }
};

// @desc    Get notifications for admin
// @route   GET /api/notifications/admin
// @access  Private (Admin)
exports.getAdminNotifications = async (req, res) => {
    try {
        const notifications = [];

        // Get new users registered in last 7 days
        const recentUsers = await User.findAll({
            where: {
                createdAt: {
                    [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                }
            },
            order: [['createdAt', 'DESC']]
        });

        // Group by date
        const today = new Date().toDateString();
        const todayUsers = recentUsers.filter(u => new Date(u.createdAt).toDateString() === today);
        
        if (todayUsers.length > 0) {
            notifications.push({
                id: `users-today`,
                icon: 'fa-user-plus',
                color: 'blue',
                title: 'New User Registration',
                message: `${todayUsers.length} new user${todayUsers.length > 1 ? 's' : ''} registered today`,
                time: todayUsers[0].createdAt,
                unread: true
            });
        }

        // Get new jobs posted in last 7 days
        const recentJobs = await Job.findAll({
            where: {
                createdAt: {
                    [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                }
            },
            include: [{
                model: User,
                as: 'company',
                attributes: ['name', 'email']
            }],
            order: [['createdAt', 'DESC']],
            limit: 10
        });

        // Group jobs by company
        const jobsByCompany = {};
        recentJobs.forEach(job => {
            const companyName = job.company?.name || job.companyName || 'Unknown Company';
            if (!jobsByCompany[companyName]) {
                jobsByCompany[companyName] = {
                    count: 0,
                    time: job.createdAt
                };
            }
            jobsByCompany[companyName].count++;
        });

        Object.entries(jobsByCompany).forEach(([company, data]) => {
            notifications.push({
                id: `jobs-${company}`,
                icon: 'fa-briefcase',
                color: 'green',
                title: 'New Job Posted',
                message: `${company} posted ${data.count} new job${data.count > 1 ? 's' : ''}`,
                time: data.time,
                unread: true
            });
        });

        // Get total application statistics
        const totalApplications = await Application.count({
            where: {
                createdAt: {
                    [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                }
            }
        });

        if (totalApplications > 0) {
            notifications.push({
                id: `apps-week`,
                icon: 'fa-chart-line',
                color: 'purple',
                title: 'Weekly Activity Report',
                message: `${totalApplications} applications submitted this week`,
                time: new Date(),
                unread: false
            });
        }

        // Check for pending applications (could indicate issues)
        const pendingApplications = await Application.count({
            where: {
                status: 'pending',
                createdAt: {
                    [Op.lte]: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // Older than 3 days
                }
            }
        });

        if (pendingApplications > 10) {
            notifications.push({
                id: `pending-apps`,
                icon: 'fa-exclamation-triangle',
                color: 'yellow',
                title: 'System Alert',
                message: `${pendingApplications} applications pending review for 3+ days`,
                time: new Date(),
                unread: true
            });
        }

        // Sort by time (most recent first)
        notifications.sort((a, b) => new Date(b.time) - new Date(a.time));

        res.json({
            success: true,
            count: notifications.length,
            unreadCount: notifications.filter(n => n.unread).length,
            data: notifications.slice(0, 20) // Limit to 20
        });

    } catch (error) {
        console.error('Error fetching admin notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching notifications'
        });
    }
};
