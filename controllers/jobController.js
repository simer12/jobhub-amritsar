const { Job, User } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all jobs with filters
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
    try {
        console.log('GET /api/jobs - Query params:', req.query);
        
        const { 
            search, 
            location, 
            jobType, 
            category,
            experience, 
            salaryMin, 
            salaryMax,
            workMode,
            page = 1, 
            limit = 20,
            sort = 'createdAt'
        } = req.query;

        // Build where clause
        let where = { status: 'active' };
        console.log('Initial where clause:', where);

        // Search by title, description, or company
        if (search) {
            where[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
                { companyName: { [Op.like]: `%${search}%` } }
            ];
        }

        // Job type filter
        if (jobType && jobType !== 'all') {
            where.jobType = jobType;
        }

        // Category filter
        if (category) {
            where.category = { [Op.like]: `%${category}%` };
        }

        // Experience filter
        if (experience && experience !== 'all') {
            where.experienceRequired = experience;
        }

        // Work mode filter
        if (workMode) {
            where.workMode = workMode;
        }

        // Pagination
        const offset = (page - 1) * limit;
        const orderDirection = sort.startsWith('-') ? 'DESC' : 'ASC';
        const orderField = sort.replace('-', '');

        // Execute query
        console.log('Final where clause:', JSON.stringify(where));
        console.log('Limit:', limit, 'Offset:', offset);
        console.log('Order by:', orderField, orderDirection);
        
        // Test query - get total count first
        const totalCount = await Job.count();
        console.log('Total jobs in database (no filter):', totalCount);
        
        const activeCount = await Job.count({ where: { status: 'active' } });
        console.log('Active jobs in database:', activeCount);
        
        const { count, rows: jobs } = await Job.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [[orderField, orderDirection]]
        });

        console.log('Found jobs:', jobs.length, 'Total count:', count);
        if (jobs.length > 0) {
            console.log('First job:', { id: jobs[0].id, title: jobs[0].title, status: jobs[0].status });
        }

        res.status(200).json({
            success: true,
            count: jobs.length,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            data: jobs
        });

    } catch (error) {
        console.error('Get jobs error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching jobs',
            error: error.message
        });
    }
};

// @desc    Get employer's own jobs
// @route   GET /api/jobs/my-jobs
// @access  Private (Employer)
exports.getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.findAll({
            where: { companyId: req.user.id },
            order: [['createdAt', 'DESC']],
            include: [{
                model: require('../models').Application,
                as: 'applications',
                attributes: ['id', 'status']
            }]
        });

        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });
    } catch (error) {
        console.error('Get my jobs error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching your jobs',
            error: error.message
        });
    }
};

// @desc    Get Amritsar specific jobs
// @route   GET /api/jobs/amritsar
// @access  Public
exports.getAmritsarJobs = async (req, res) => {
    try {
        const jobs = await Job.find({
            status: 'active',
            'location.city': 'Amritsar'
        })
        .sort('-createdAt')
        .limit(50)
        .populate('company', 'name companyName companyLogo');

        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching Amritsar jobs',
            error: error.message
        });
    }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('company', 'name email phone companyName companyLogo companyWebsite companyDescription');

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Increment views
        await job.incrementViews();

        res.status(200).json({
            success: true,
            data: job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching job',
            error: error.message
        });
    }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Employer)
exports.createJob = async (req, res) => {
    try {
        // Add user to req.body
        req.body.company = req.user.id;
        req.body.companyName = req.user.companyName || req.user.name;
        req.body.companyLogo = req.user.companyLogo;

        // Set default location to Amritsar if not provided
        if (!req.body.location) {
            req.body.location = {
                city: 'Amritsar',
                area: ''
            };
        }

        const job = await Job.create(req.body);

        res.status(201).json({
            success: true,
            data: job,
            message: 'Job posted successfully'
        });
    } catch (error) {
        console.error('Create job error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating job',
            error: error.message
        });
    }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Employer - own jobs)
exports.updateJob = async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Make sure user is job owner
        if (job.company.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to update this job'
            });
        }

        job = await Job.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: job,
            message: 'Job updated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating job',
            error: error.message
        });
    }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Employer - own jobs)
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // Make sure user is job owner
        if (job.company.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to delete this job'
            });
        }

        await job.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Job deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting job',
            error: error.message
        });
    }
};

// @desc    Advanced job search
// @route   GET /api/jobs/search/advanced
// @access  Public
exports.advancedSearch = async (req, res) => {
    try {
        const { keywords, skills, languages } = req.query;

        let query = { status: 'active' };

        if (keywords) {
            query.$text = { $search: keywords };
        }

        if (skills) {
            const skillsArray = skills.split(',');
            query.skills = { $in: skillsArray };
        }

        if (languages) {
            const languagesArray = languages.split(',');
            query.languagesRequired = { $in: languagesArray };
        }

        const jobs = await Job.find(query)
            .sort('-createdAt')
            .populate('company', 'name companyName companyLogo');

        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error in advanced search',
            error: error.message
        });
    }
};

// @desc    Save/bookmark a job
// @route   POST /api/jobs/:id/save
// @access  Private (Job seeker)
exports.saveJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        const user = await User.findById(req.user.id);

        // Check if already saved
        if (user.savedJobs.includes(job._id)) {
            return res.status(400).json({
                success: false,
                message: 'Job already saved'
            });
        }

        user.savedJobs.push(job._id);
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Job saved successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error saving job',
            error: error.message
        });
    }
};

// @desc    Remove saved job
// @route   DELETE /api/jobs/:id/save
// @access  Private (Job seeker)
exports.removeSavedJob = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        user.savedJobs = user.savedJobs.filter(
            jobId => jobId.toString() !== req.params.id
        );

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Job removed from saved list'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error removing saved job',
            error: error.message
        });
    }
};

// @desc    Get all saved jobs
// @route   GET /api/jobs/saved/all
// @access  Private (Job seeker)
exports.getSavedJobs = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'savedJobs',
            populate: {
                path: 'company',
                select: 'name companyName companyLogo'
            }
        });

        res.status(200).json({
            success: true,
            count: user.savedJobs.length,
            data: user.savedJobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching saved jobs',
            error: error.message
        });
    }
};
