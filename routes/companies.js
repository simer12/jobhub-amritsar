const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { protect } = require('../middleware/auth');

// @route   GET /api/companies
// @desc    Get all companies
// @access  Public
router.get('/', companyController.getCompanies);

// @route   GET /api/companies/:id
// @desc    Get single company
// @access  Public
router.get('/:id', companyController.getCompany);

// @route   GET /api/companies/:id/jobs
// @desc    Get company jobs
// @access  Public
router.get('/:id/jobs', companyController.getCompanyJobs);

module.exports = router;
