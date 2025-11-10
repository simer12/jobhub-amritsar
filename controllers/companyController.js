const User = require('../models/User');
const Job = require('../models/Job');

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
exports.getCompanies = async (req, res) => {
    try {
        const companies = await User.find({ 
            role: 'employer',
            isActive: true 
        }).select('name companyName companyLogo companySize companyType companyWebsite companyDescription');

        res.status(200).json({
            success: true,
            count: companies.length,
            data: companies
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching companies',
            error: error.message
        });
    }
};

// @desc    Get single company
// @route   GET /api/companies/:id
// @access  Public
exports.getCompany = async (req, res) => {
    try {
        const company = await User.findOne({
            _id: req.params.id,
            role: 'employer'
        }).select('-password -resetPasswordToken -resetPasswordExpire');

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Company not found'
            });
        }

        // Get company's active jobs count
        const jobsCount = await Job.countDocuments({
            company: company._id,
            status: 'active'
        });

        res.status(200).json({
            success: true,
            data: {
                ...company.toObject(),
                activeJobsCount: jobsCount
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching company',
            error: error.message
        });
    }
};

// @desc    Get company jobs
// @route   GET /api/companies/:id/jobs
// @access  Public
exports.getCompanyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({
            company: req.params.id,
            status: 'active'
        }).sort('-createdAt');

        res.status(200).json({
            success: true,
            count: jobs.length,
            data: jobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching company jobs',
            error: error.message
        });
    }
};
