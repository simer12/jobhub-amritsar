const { sequelize, User, Job } = require('./models');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Helper function to hash password
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Sample employers
const createEmployers = async () => [
    {
        name: 'Admin',
        email: 'admin@jobhub.com',
        phone: '9999999999',
        password: await hashPassword('admin123'),
        role: 'admin',
        languagesKnown: ['English', 'Hindi', 'Punjabi'],
        currentLocation: 'Amritsar',
        isVerified: true
    },
    {
        name: 'Rajesh Kumar',
        email: 'rajesh@techAmr.com',
        phone: '9876543210',
        password: await hashPassword('password123'),
        role: 'employer',
        companyName: 'TechAmr Solutions',
        companySize: '51-200',
        companyType: 'startup',
        companyDescription: 'Leading IT company in Amritsar providing software development and digital marketing services',
        companyWebsite: 'www.techamr.com',
        languagesKnown: ['English', 'Hindi', 'Punjabi'],
        currentLocation: 'Amritsar',
        localArea: 'Ranjit Avenue',
        isVerified: true
    },
    {
        name: 'Simran Kaur',
        email: 'hr@retailhub.com',
        phone: '9876543211',
        password: await hashPassword('password123'),
        role: 'employer',
        companyName: 'Retail Hub Amritsar',
        companySize: '11-50',
        companyType: 'corporate',
        companyDescription: 'Multi-brand retail store chain across Punjab',
        companyWebsite: 'www.retailhub.in',
        languagesKnown: ['English', 'Hindi', 'Punjabi'],
        currentLocation: 'Amritsar',
        localArea: 'Mall Road',
        isVerified: true
    }
];

// Sample job seekers
const createJobSeekers = async () => [
    {
        name: 'Manpreet Kaur',
        email: 'manpreet@example.com',
        phone: '9876543220',
        password: await hashPassword('password123'),
        role: 'jobseeker',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
        experience: '1-3',
        education: 'Graduate',
        currentLocation: 'Amritsar',
        localArea: 'Ranjit Avenue',
        preferredJobType: 'fulltime',
        languagesKnown: ['English', 'Hindi', 'Punjabi'],
        expectedSalary: { min: 300000, max: 500000 },
        bio: 'Passionate web developer looking for opportunities in Amritsar'
    }
];

// Sample jobs specific to Amritsar
const createJobs = (employerIds) => [
    {
        title: 'Full Stack Developer',
        description: 'We are looking for a talented Full Stack Developer to join our growing team in Amritsar.',
        requirements: ['3+ years of experience in web development', 'Strong knowledge of React and Node.js'],
        responsibilities: ['Develop and maintain web applications', 'Collaborate with design team'],
        companyId: employerIds[0], // First employer (TechAmr)
        companyName: 'TechAmr Solutions',
        location: { city: 'Amritsar', area: 'Ranjit Avenue', fullAddress: 'TechAmr Solutions, Plot 45, Ranjit Avenue, Amritsar', pincode: '143001' },
        jobType: 'fulltime',
        workMode: 'office',
        category: 'IT & Software',
        experienceRequired: '3-5',
        educationRequired: 'Graduate',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
        salary: { min: 400000, max: 700000, currency: 'INR', period: 'year' },
        vacancies: 2,
        languagesRequired: ['English', 'Punjabi'],
        benefits: ['Health Insurance', 'Flexible Hours'],
        status: 'active',
        isVerified: true,
        tags: ['tech', 'amritsar', 'fullstack']
    },
    {
        title: 'Store Manager',
        description: 'Retail Hub is seeking an experienced Store Manager for our Mall Road branch.',
        requirements: ['5+ years retail experience', 'Team management skills'],
        responsibilities: ['Manage daily store operations', 'Lead and motivate team'],
        companyId: employerIds[1], // Second employer (Retail Hub)
        companyName: 'Retail Hub Amritsar',
        location: { city: 'Amritsar', area: 'Mall Road', fullAddress: 'Retail Hub, Shop 12, Mall Road, Amritsar', pincode: '143001' },
        jobType: 'fulltime',
        workMode: 'office',
        category: 'Retail',
        experienceRequired: '5-10',
        educationRequired: 'Graduate',
        skills: ['Retail Management', 'Sales', 'Team Leadership'],
        salary: { min: 350000, max: 500000, currency: 'INR', period: 'year' },
        vacancies: 1,
        languagesRequired: ['Hindi', 'Punjabi', 'English'],
        benefits: ['Performance Bonus', 'Employee Discounts'],
        status: 'active',
        isVerified: true,
        isUrgent: true,
        tags: ['retail', 'amritsar', 'management']
    }
];

// Auto-seed function (doesn't exit the process)
const autoSeed = async () => {
    try {
        console.log('🌱 Starting auto-seed...');

        // Check if data already exists
        const userCount = await User.count();
        if (userCount > 0) {
            console.log('✅ Database already has users, skipping seed');
            return;
        }

        // Create users with hashed passwords
        const employers = await createEmployers();
        const jobSeekers = await createJobSeekers();
        const allUsers = [...employers, ...jobSeekers];
        
        // Use bulkCreate with individualHooks to ensure password hashing
        const createdUsers = await User.bulkCreate(allUsers, { 
            individualHooks: true,
            validate: true 
        });
        console.log(`✅ Created ${createdUsers.length} users (admin + employers + job seekers)`);

        // Get employer IDs (skip admin at index 0)
        const employerIds = createdUsers.filter(u => u.role === 'employer').map(emp => emp.id);

        // Create jobs
        const jobs = createJobs(employerIds);
        const createdJobs = await Job.bulkCreate(jobs);
        console.log(`✅ Created ${createdJobs.length} jobs`);

        console.log('\n🎉 Auto-seed completed successfully!');
        console.log('\n🔑 Login Credentials:');
        console.log('   Admin: admin@jobhub.com / admin123');
        console.log('   Employer: rajesh@techAmr.com / password123');
        console.log('   Job Seeker: manpreet@example.com / password123');
        console.log('\n');

    } catch (error) {
        console.error('❌ Error in auto-seed:', error);
    }
};

module.exports = autoSeed;
