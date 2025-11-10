const { sequelize, User, Job, Application } = require('./models');
require('dotenv').config();

// Sample employers
const employers = [
    {
        name: 'Rajesh Kumar',
        email: 'rajesh@techAmr.com',
        phone: '9876543210',
        password: 'password123',
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
        password: 'password123',
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
    },
    {
        name: 'Gurpreet Singh',
        email: 'info@hospitalityAmr.com',
        phone: '9876543212',
        password: 'password123',
        role: 'employer',
        companyName: 'Golden Temple Hospitality',
        companySize: '201-500',
        companyType: 'corporate',
        companyDescription: 'Premium hotel and restaurant chain in Amritsar',
        companyWebsite: 'www.gthospitality.com',
        languagesKnown: ['English', 'Hindi', 'Punjabi'],
        currentLocation: 'Amritsar',
        localArea: 'Heritage Street',
        isVerified: true
    },
    {
        name: 'Neha Sharma',
        email: 'hr@edutech.com',
        phone: '9876543213',
        password: 'password123',
        role: 'employer',
        companyName: 'EduTech Learning Center',
        companySize: '11-50',
        companyType: 'startup',
        companyDescription: 'Modern educational institute offering tech courses and skill development',
        companyWebsite: 'www.edutech-amritsar.com',
        languagesKnown: ['English', 'Hindi', 'Punjabi'],
        currentLocation: 'Amritsar',
        localArea: 'Lawrence Road',
        isVerified: true
    },
    {
        name: 'Amit Verma',
        email: 'contact@healthplus.com',
        phone: '9876543214',
        password: 'password123',
        role: 'employer',
        companyName: 'Health Plus Clinic',
        companySize: '51-200',
        companyType: 'corporate',
        companyDescription: 'Multi-specialty healthcare clinic with modern facilities',
        companyWebsite: 'www.healthplus-amr.com',
        languagesKnown: ['English', 'Hindi', 'Punjabi'],
        currentLocation: 'Amritsar',
        localArea: 'Court Road',
        isVerified: true
    }
];

// Sample job seekers
const jobSeekers = [
    {
        name: 'Manpreet Kaur',
        email: 'manpreet@example.com',
        phone: '9876543220',
        password: 'password123',
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
    },
    {
        name: 'Harjot Singh',
        email: 'harjot@example.com',
        phone: '9876543221',
        password: 'password123',
        role: 'jobseeker',
        skills: ['Sales', 'Marketing', 'Customer Service'],
        experience: '3-5',
        education: 'Graduate',
        currentLocation: 'Amritsar',
        localArea: 'Mall Road',
        preferredJobType: 'fulltime',
        languagesKnown: ['English', 'Hindi', 'Punjabi'],
        expectedSalary: { min: 250000, max: 400000 },
        bio: 'Experienced sales professional with proven track record'
    }
];

// Sample jobs specific to Amritsar
const createJobs = (employerIds) => [
    {
        title: 'Full Stack Developer',
        description: 'We are looking for a talented Full Stack Developer to join our growing team in Amritsar.',
        requirements: ['3+ years of experience in web development', 'Strong knowledge of React and Node.js'],
        responsibilities: ['Develop and maintain web applications', 'Collaborate with design team'],
        companyId: employerIds[0],
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
        companyId: employerIds[1],
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
    },
    {
        title: 'Hotel Front Desk Executive',
        description: 'Golden Temple Hospitality is hiring friendly and professional front desk staff.',
        requirements: ['Excellent communication skills', 'Customer service experience'],
        responsibilities: ['Guest check-in/check-out', 'Handle reservations'],
        companyId: employerIds[2],
        companyName: 'Golden Temple Hospitality',
        location: { city: 'Amritsar', area: 'Heritage Street', fullAddress: 'Golden Temple Hotel, Heritage Street, Amritsar', pincode: '143006' },
        jobType: 'fulltime',
        workMode: 'office',
        category: 'Hospitality & Tourism',
        experienceRequired: '1-3',
        educationRequired: '12th',
        skills: ['Customer Service', 'Communication'],
        salary: { min: 180000, max: 300000, currency: 'INR', period: 'year' },
        vacancies: 3,
        languagesRequired: ['English', 'Hindi', 'Punjabi'],
        benefits: ['Meals Provided', 'Uniform', 'Tips'],
        status: 'active',
        isVerified: true,
        tags: ['hospitality', 'hotel', 'amritsar']
    },
    {
        title: 'Computer Teacher',
        description: 'EduTech Learning Center seeks passionate computer teachers.',
        requirements: ['B.Tech/MCA or equivalent', 'Teaching experience preferred'],
        responsibilities: ['Teach computer courses', 'Prepare lesson plans'],
        companyId: employerIds[3],
        companyName: 'EduTech Learning Center',
        location: { city: 'Amritsar', area: 'Lawrence Road', fullAddress: 'EduTech Center, Lawrence Road, Amritsar', pincode: '143001' },
        jobType: 'fulltime',
        workMode: 'office',
        category: 'Education & Training',
        experienceRequired: '1-3',
        educationRequired: 'Post Graduate',
        skills: ['Teaching', 'Programming', 'C++', 'Python'],
        salary: { min: 250000, max: 400000, currency: 'INR', period: 'year' },
        vacancies: 2,
        languagesRequired: ['English', 'Hindi', 'Punjabi'],
        benefits: ['Summer Vacation', 'Professional Development'],
        status: 'active',
        isVerified: true,
        tags: ['education', 'teaching', 'amritsar']
    },
    {
        title: 'Nursing Staff',
        description: 'Health Plus Clinic requires qualified nursing staff.',
        requirements: ['GNM/B.Sc Nursing', 'Punjab Nursing Council Registration'],
        responsibilities: ['Patient care', 'Medication administration'],
        companyId: employerIds[4],
        companyName: 'Health Plus Clinic',
        location: { city: 'Amritsar', area: 'Court Road', fullAddress: 'Health Plus Clinic, Court Road, Amritsar', pincode: '143001' },
        jobType: 'fulltime',
        workMode: 'office',
        category: 'Healthcare',
        experienceRequired: '1-3',
        educationRequired: 'Graduate',
        skills: ['Nursing', 'Patient Care', 'Medical Knowledge'],
        salary: { min: 300000, max: 450000, currency: 'INR', period: 'year' },
        vacancies: 4,
        languagesRequired: ['Hindi', 'Punjabi', 'English'],
        benefits: ['Health Insurance', 'Night Shift Allowance'],
        status: 'active',
        isVerified: true,
        isUrgent: true,
        tags: ['healthcare', 'nursing', 'amritsar']
    },
    {
        title: 'Digital Marketing Executive',
        description: 'Join our digital marketing team and help local Amritsar businesses grow.',
        requirements: ['Digital marketing experience', 'Social media expertise'],
        responsibilities: ['Manage social media accounts', 'Create marketing campaigns'],
        companyId: employerIds[0],
        companyName: 'TechAmr Solutions',
        location: { city: 'Amritsar', area: 'Ranjit Avenue', fullAddress: 'TechAmr Solutions, Plot 45, Ranjit Avenue, Amritsar', pincode: '143001' },
        jobType: 'fulltime',
        workMode: 'hybrid',
        category: 'Marketing & Sales',
        experienceRequired: '1-3',
        educationRequired: 'Graduate',
        skills: ['Digital Marketing', 'SEO', 'Social Media'],
        salary: { min: 250000, max: 400000, currency: 'INR', period: 'year' },
        vacancies: 2,
        languagesRequired: ['English', 'Hindi', 'Punjabi'],
        benefits: ['Work from Home Options', 'Performance Bonus'],
        status: 'active',
        isVerified: true,
        tags: ['marketing', 'digital', 'amritsar']
    },
    {
        title: 'Delivery Partner',
        description: 'Flexible part-time opportunity for bike/scooter owners in Amritsar.',
        requirements: ['Own vehicle (bike/scooter)', 'Valid driving license'],
        responsibilities: ['Pick up and deliver orders', 'Maintain delivery timeline'],
        companyId: employerIds[1],
        companyName: 'Retail Hub Amritsar',
        location: { city: 'Amritsar', area: 'All Areas', fullAddress: 'Amritsar, Punjab', pincode: '143001' },
        jobType: 'parttime',
        workMode: 'office',
        category: 'Transportation',
        experienceRequired: 'fresher',
        educationRequired: '10th',
        skills: ['Driving', 'Navigation', 'Customer Service'],
        salary: { min: 15000, max: 30000, currency: 'INR', period: 'month' },
        vacancies: 10,
        languagesRequired: ['Punjabi', 'Hindi'],
        benefits: ['Fuel Allowance', 'Incentives', 'Flexible Hours'],
        status: 'active',
        isVerified: true,
        tags: ['delivery', 'parttime', 'amritsar']
    },
    {
        title: 'Accountant',
        description: 'Experienced accountant needed for maintaining financial records.',
        requirements: ['B.Com/M.Com', 'Tally proficiency', '3+ years experience'],
        responsibilities: ['Maintain accounts books', 'GST filing', 'Financial reporting'],
        companyId: employerIds[2],
        companyName: 'Golden Temple Hospitality',
        location: { city: 'Amritsar', area: 'Heritage Street', fullAddress: 'Golden Temple Hotel, Heritage Street, Amritsar', pincode: '143006' },
        jobType: 'fulltime',
        workMode: 'office',
        category: 'Finance & Accounting',
        experienceRequired: '3-5',
        educationRequired: 'Graduate',
        skills: ['Accounting', 'Tally', 'GST', 'Excel'],
        salary: { min: 300000, max: 450000, currency: 'INR', period: 'year' },
        vacancies: 1,
        languagesRequired: ['English', 'Hindi', 'Punjabi'],
        benefits: ['Insurance', 'Provident Fund', 'Bonus'],
        status: 'active',
        isVerified: true,
        tags: ['accounts', 'finance', 'amritsar']
    }
];

// Seed data function
const seedData = async () => {
    try {
        console.log('🌱 Starting database seed...');

        // Connect and sync database
        await sequelize.sync({ force: true }); // This will drop and recreate tables
        console.log('✅ Database synced');

        // Create employers
        const createdEmployers = await User.bulkCreate(employers);
        console.log(`✅ Created ${createdEmployers.length} employers`);

        // Create job seekers
        const createdJobSeekers = await User.bulkCreate(jobSeekers);
        console.log(`✅ Created ${createdJobSeekers.length} job seekers`);

        // Get employer IDs
        const employerIds = createdEmployers.map(emp => emp.id);

        // Create jobs
        const jobs = createJobs(employerIds);
        const createdJobs = await Job.bulkCreate(jobs);
        console.log(`✅ Created ${createdJobs.length} jobs`);

        console.log('\n🎉 Database seeded successfully!');
        console.log('\n📊 Summary:');
        console.log(`   - Employers: ${createdEmployers.length}`);
        console.log(`   - Job Seekers: ${createdJobSeekers.length}`);
        console.log(`   - Jobs: ${createdJobs.length}`);
        console.log('\n🔑 Login Credentials:');
        console.log('   Employer: rajesh@techAmr.com / password123');
        console.log('   Job Seeker: manpreet@example.com / password123');
        console.log('\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run seed
seedData();
