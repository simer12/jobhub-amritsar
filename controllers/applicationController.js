const { Application, Job, User } = require('../models');
const { Op } = require('sequelize');

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Job seeker)
exports.applyForJob = async (req, res) => {
    try {
        const jobId = parseInt(req.params.jobId);
        console.log('Apply for job - Job ID (parsed):', jobId);
        console.log('User ID:', req.user.id);
        console.log('Request body:', req.body);
        
        const job = await Job.findByPk(jobId);
        console.log('Job found:', job ? `Yes (ID: ${job.id}, Title: ${job.title})` : 'null');

        if (!job) {
            console.log('Job not found with ID:', jobId);
            return res.status(404).json({
                success: false,
                message: `Job not found with ID: ${jobId}`
            });
        }

        if (job.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: 'This job is no longer accepting applications'
            });
        }

        // Check if already applied
        const existingApplication = await Application.findOne({
            where: {
                jobId: jobId,
                applicantId: req.user.id
            }
        });

        console.log('Existing application check:', existingApplication ? `Found (ID: ${existingApplication.id})` : 'None');

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied for this job'
            });
        }

        // Store additional application data in employerNotes as JSON for now
        const additionalData = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            experience: req.body.experience,
            currentLocation: req.body.currentLocation,
            currentJobTitle: req.body.currentJobTitle,
            skills: req.body.skills,
            education: req.body.education,
            expectedSalary: req.body.expectedSalary,
            noticePeriod: req.body.noticePeriod
        };

        const applicationData = {
            jobId: jobId,
            applicantId: req.user.id,
            employerId: job.companyId,
            coverLetter: req.body.coverLetter || '',
            resume: req.file ? req.file.path : (req.user.resume || 'No resume provided'),
            status: 'pending',
            employerNotes: JSON.stringify(additionalData) // Store additional data here
        };

        console.log('Creating application with data:', { 
            jobId, 
            applicantId: req.user.id, 
            employerId: job.companyId,
            resume: applicationData.resume 
        });

        const application = await Application.create(applicationData);

        // Update job's application count
        await job.increment('applicationCount');

        res.status(201).json({
            success: true,
            data: application,
            message: 'Application submitted successfully'
        });

    } catch (error) {
        console.error('Apply job error:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting application',
            error: error.message
        });
    }
};

// @desc    Get user's applications
// @route   GET /api/applications/my-applications
// @access  Private (Job seeker)
exports.getMyApplications = async (req, res) => {
    try {
        const applications = await Application.findAll({
            where: { applicantId: req.user.id },
            include: [{
                model: Job,
                as: 'job',
                attributes: ['id', 'title', 'companyName', 'location', 'salary', 'jobType']
            }],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(applications);
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message
        });
    }
};

// @desc    Get all applications for a job
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer - own jobs)
exports.getJobApplications = async (req, res) => {
    try {
        const job = await Job.findByPk(req.params.jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Make sure user is job owner
        if (job.companyId !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to view these applications'
            });
        }

        const applications = await Application.findAll({
            where: { jobId: req.params.jobId },
            include: [{
                model: User,
                as: 'applicant',
                attributes: ['id', 'name', 'email', 'phone', 'skills', 'experience', 'education']
            }],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message
        });
    }
};

// @desc    Get employer's applications
// @route   GET /api/applications/employer-applications
// @access  Private (Employer)
exports.getEmployerApplications = async (req, res) => {
    try {
        const applications = await Application.findAll({
            where: { employerId: req.user.id },
            include: [
                {
                    model: Job,
                    as: 'job',
                    attributes: ['id', 'title', 'companyName']
                },
                {
                    model: User,
                    as: 'applicant',
                    attributes: ['id'] // Only get ID to generate anonymous username
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Anonymize applicant data
        const anonymizedApplications = applications.map((app, index) => {
            const appData = app.toJSON();
            
            // Parse additional data from employerNotes
            let additionalData = {};
            try {
                if (app.employerNotes) {
                    additionalData = JSON.parse(app.employerNotes);
                }
            } catch (e) {
                console.log('Error parsing employerNotes:', e);
            }
            
            // Create anonymous applicant data
            appData.applicant = {
                id: app.applicantId,
                anonymousName: `Applicant ${app.applicantId}`, // Use applicant ID for consistent naming
                // Include all data EXCEPT name, email, phone, and resume
                experience: additionalData.experience,
                currentLocation: additionalData.currentLocation,
                currentJobTitle: additionalData.currentJobTitle,
                skills: additionalData.skills,
                education: additionalData.education,
                expectedSalary: additionalData.expectedSalary,
                noticePeriod: additionalData.noticePeriod
            };
            
            // Include cover letter but hide contact info
            appData.coverLetter = app.coverLetter;
            
            // Remove employerNotes from response (it has the sensitive data)
            delete appData.employerNotes;
            
            return appData;
        });

        res.status(200).json(anonymizedApplications);
    } catch (error) {
        console.error('Get employer applications error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching applications',
            error: error.message
        });
    }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
exports.getApplication = async (req, res) => {
    try {
        const application = await Application.findByPk(req.params.id, {
            include: [
                { model: Job, as: 'job' },
                {
                    model: User,
                    as: 'applicant',
                    attributes: ['id'] // Only get ID for anonymous name
                },
                {
                    model: User,
                    as: 'employer',
                    attributes: ['id', 'name', 'companyName', 'email', 'phone']
                }
            ]
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Make sure user is authorized
        if (
            application.applicantId !== req.user.id &&
            application.employerId !== req.user.id &&
            req.user.role !== 'admin'
        ) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to view this application'
            });
        }

        const appData = application.toJSON();
        
        // If employer is viewing, check permission and anonymize if needed
        if (req.user.id === application.employerId) {
            // Parse additional data from employerNotes
            let additionalData = {};
            try {
                if (application.employerNotes) {
                    additionalData = JSON.parse(application.employerNotes);
                }
            } catch (e) {
                console.log('Error parsing employerNotes:', e);
            }
            
            // Check if access is granted
            if (application.detailsAccessGranted) {
                // Show real details
                const applicant = await User.findByPk(application.applicantId, {
                    attributes: ['id', 'name', 'email', 'phone']
                });
                
                appData.applicant = applicant;
                appData.additionalData = additionalData;
                appData.accessGranted = true;
            } else {
                // Anonymize applicant
                appData.applicant = {
                    id: application.applicantId,
                    anonymousName: `Applicant ${application.applicantId}`
                };
                appData.employerNotes = additionalData;
                appData.accessGranted = false;
                appData.accessRequested = application.detailsAccessRequested || false;
            }
        } else if (req.user.role === 'admin') {
            // Admin can always see everything
            let additionalData = {};
            try {
                if (application.employerNotes) {
                    additionalData = JSON.parse(application.employerNotes);
                }
            } catch (e) {
                console.log('Error parsing employerNotes:', e);
            }
            
            const applicant = await User.findByPk(application.applicantId, {
                attributes: ['id', 'name', 'email', 'phone', 'skills', 'experience', 'education']
            });
            
            appData.applicant = applicant;
            appData.additionalData = additionalData;
            appData.accessGranted = true;
        }

        res.status(200).json({
            success: true,
            data: appData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching application',
            error: error.message
        });
    }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Employer)
exports.updateApplicationStatus = async (req, res) => {
    try {
        const application = await Application.findByPk(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Make sure user is the employer
        if (application.employerId !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this application'
            });
        }

        const { status, notes } = req.body;

        application.status = status;
        if (notes) application.notes = notes;
        await application.save();

        res.status(200).json({
            success: true,
            data: application,
            message: 'Application status updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating application status',
            error: error.message
        });
    }
};

// @desc    Schedule interview
// @route   PUT /api/applications/:id/interview
// @access  Private (Employer)
exports.scheduleInterview = async (req, res) => {
    try {
        const application = await Application.findByPk(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Make sure user is the employer
        if (application.employerId !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to schedule interview'
            });
        }

        application.interviewDate = req.body.date;
        application.interviewTime = req.body.time;
        application.status = 'interview_scheduled';
        await application.save();

        res.status(200).json({
            success: true,
            data: application,
            message: 'Interview scheduled successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error scheduling interview',
            error: error.message
        });
    }
};

// @desc    Withdraw application
// @route   DELETE /api/applications/:id
// @access  Private (Job seeker - own application)
exports.withdrawApplication = async (req, res) => {
    try {
        const application = await Application.findByPk(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Make sure user is the applicant
        if (application.applicantId !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to withdraw this application'
            });
        }

        application.status = 'withdrawn';
        await application.save();

        res.status(200).json({
            success: true,
            message: 'Application withdrawn successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error withdrawing application',
            error: error.message
        });
    }
};

// @desc    Request access to applicant details
// @route   POST /api/applications/:id/request-details
// @access  Private (Employer)
exports.requestDetailsAccess = async (req, res) => {
    try {
        const application = await Application.findByPk(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        // Make sure user is the employer
        if (application.employerId !== req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to request access to this application'
            });
        }

        // Check if already requested or granted
        if (application.detailsAccessGranted) {
            return res.status(400).json({
                success: false,
                message: 'Access already granted'
            });
        }

        if (application.detailsAccessRequested) {
            return res.status(400).json({
                success: false,
                message: 'Access request already pending'
            });
        }

        application.detailsAccessRequested = true;
        application.detailsAccessRequestedAt = new Date();
        await application.save();

        res.status(200).json({
            success: true,
            message: 'Access request submitted. Waiting for admin approval.',
            data: application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error requesting access',
            error: error.message
        });
    }
};

// @desc    Grant access to applicant details (Admin only)
// @route   POST /api/applications/:id/grant-details
// @access  Private (Admin)
exports.grantDetailsAccess = async (req, res) => {
    try {
        const application = await Application.findByPk(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        application.detailsAccessGranted = true;
        application.detailsAccessGrantedAt = new Date();
        application.detailsAccessGrantedBy = req.user.id;
        await application.save();

        res.status(200).json({
            success: true,
            message: 'Access granted successfully',
            data: application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error granting access',
            error: error.message
        });
    }
};

// @desc    Get pending access requests (Admin only)
// @route   GET /api/applications/access-requests
// @access  Private (Admin)
exports.getPendingAccessRequests = async (req, res) => {
    try {
        console.log('Fetching pending access requests...');
        
        const applications = await Application.findAll({
            where: {
                detailsAccessRequested: true,
                detailsAccessGranted: false
            },
            include: [
                {
                    model: Job,
                    as: 'job',
                    attributes: ['id', 'title', 'companyName'],
                    required: false
                },
                {
                    model: User,
                    as: 'employer',
                    attributes: ['id', 'name', 'companyName', 'email'],
                    required: false
                },
                {
                    model: User,
                    as: 'applicant',
                    attributes: ['id', 'name', 'email', 'phone'],
                    required: false
                }
            ],
            order: [['detailsAccessRequestedAt', 'DESC']]
        });

        console.log(`Found ${applications.length} pending access requests`);

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        console.error('Error fetching access requests:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching access requests',
            error: error.message
        });
    }
};
