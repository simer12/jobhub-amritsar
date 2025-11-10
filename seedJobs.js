const { Job, User } = require('./models');
const { sequelize } = require('./config/database');

async function seedJobs() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected');

        // Find or create a recruiter user
        let recruiter = await User.findOne({ where: { role: 'employer' } });
        
        if (!recruiter) {
            console.log('Creating recruiter user...');
            recruiter = await User.create({
                name: 'Rajesh Kumar',
                email: 'rajesh@amritsar.com',
                password: '$2a$10$YourHashedPasswordHere', // This will be overwritten if user exists
                role: 'employer',
                phone: '+91 98765-43210',
                companyName: 'Tech Solutions Amritsar'
            });
        }

        console.log('✅ Recruiter found/created:', recruiter.email);

        // Create sample jobs
        const sampleJobs = [
            {
                title: 'Senior Software Developer',
                companyName: 'Tech Solutions Amritsar',
                companyId: recruiter.id,
                location: 'Amritsar, Punjab',
                jobType: 'full-time',
                workMode: 'hybrid',
                category: 'Technology',
                experienceRequired: '3-5 years',
                salaryRange: '₹8-12 LPA',
                salary: 1000000, // 10 LPA (in annual amount)
                educationRequired: 'Bachelor\'s Degree',
                description: `We are looking for an experienced Software Developer to join our team in Amritsar.

**Responsibilities:**
- Develop and maintain web applications
- Write clean, maintainable code
- Collaborate with cross-functional teams
- Participate in code reviews

**Requirements:**
- 3+ years of experience in software development
- Strong knowledge of JavaScript, Node.js, React
- Experience with databases (SQL/NoSQL)
- Good communication skills`,
                requirements: 'Bachelor\'s degree in Computer Science, 3+ years experience, JavaScript, Node.js, React',
                benefits: 'Health insurance, Work from home, Flexible hours, Annual bonus',
                applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                status: 'active'
            },
            {
                title: 'Digital Marketing Manager',
                companyName: 'Marketing Pro Amritsar',
                companyId: recruiter.id,
                location: 'Amritsar, Punjab',
                jobType: 'full-time',
                workMode: 'office',
                category: 'Marketing',
                experienceRequired: '2-4 years',
                salaryRange: '₹5-8 LPA',
                salary: 650000, // 6.5 LPA average
                educationRequired: 'Bachelor\'s Degree in Marketing',
                description: `Join our growing marketing team and lead digital campaigns.

**Responsibilities:**
- Plan and execute digital marketing campaigns
- Manage social media presence
- Analyze campaign performance
- SEO/SEM optimization

**Requirements:**
- 2+ years in digital marketing
- Experience with Google Ads, Facebook Ads
- Strong analytical skills
- Creative mindset`,
                requirements: 'Bachelor\'s degree in Marketing, 2+ years experience, Google Ads, Social Media',
                benefits: 'Performance bonus, Health insurance, Career growth opportunities',
                applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                status: 'active'
            },
            {
                title: 'Full Stack Developer',
                companyName: 'WebCraft Solutions',
                companyId: recruiter.id,
                location: 'Amritsar, Punjab',
                jobType: 'full-time',
                workMode: 'remote',
                category: 'Technology',
                experienceRequired: '1-3 years',
                salaryRange: '₹4-7 LPA',
                salary: 550000, // 5.5 LPA average
                educationRequired: 'Bachelor\'s Degree in CS/IT',
                description: `Build modern web applications with latest technologies.

**Tech Stack:**
- Frontend: React, Next.js, Tailwind CSS
- Backend: Node.js, Express, PostgreSQL
- DevOps: Docker, AWS

**What we offer:**
- 100% remote work
- Flexible hours
- Learning opportunities
- Modern tech stack`,
                requirements: 'React, Node.js, Express, PostgreSQL, REST APIs',
                benefits: 'Remote work, Flexible hours, Health insurance, Learning budget',
                applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
                status: 'active'
            },
            {
                title: 'UI/UX Designer',
                companyName: 'Creative Studio Amritsar',
                companyId: recruiter.id,
                location: 'Amritsar, Punjab',
                jobType: 'full-time',
                workMode: 'hybrid',
                category: 'Design',
                experienceRequired: '2-4 years',
                salaryRange: '₹4-6 LPA',
                salary: 500000, // 5 LPA average
                educationRequired: 'Bachelor\'s Degree in Design',
                description: `Create beautiful and intuitive user experiences.

**Responsibilities:**
- Design web and mobile interfaces
- Create wireframes and prototypes
- Conduct user research
- Work closely with developers

**Skills Required:**
- Figma, Adobe XD
- Prototyping tools
- User research methodologies
- Strong portfolio`,
                requirements: 'Figma, Adobe XD, Sketch, Prototyping, Portfolio required',
                benefits: 'Creative freedom, Flexible timing, Health insurance',
                applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                status: 'active'
            },
            {
                title: 'Business Development Executive',
                companyName: 'Growth Partners',
                companyId: recruiter.id,
                location: 'Amritsar, Punjab',
                jobType: 'full-time',
                workMode: 'office',
                category: 'Sales',
                experienceRequired: '1-2 years',
                salaryRange: '₹3-5 LPA + Incentives',
                salary: 400000, // 4 LPA base
                educationRequired: 'Bachelor\'s Degree in any field',
                description: `Drive business growth through client acquisition and relationship management.

**Key Responsibilities:**
- Generate new business opportunities
- Build and maintain client relationships
- Meet sales targets
- Market research

**Requirements:**
- Excellent communication skills
- Sales experience preferred
- Self-motivated
- Local area knowledge`,
                requirements: 'Bachelor\'s degree, Sales experience, Communication skills',
                benefits: 'High incentives, Health insurance, Career growth',
                applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                status: 'active'
            }
        ];

        console.log('Creating sample jobs...');
        
        for (const jobData of sampleJobs) {
            const job = await Job.create(jobData);
            console.log(`✅ Created: ${job.title} (ID: ${job.id})`);
        }

        console.log('\n🎉 Successfully created', sampleJobs.length, 'sample jobs!');
        console.log('\nYou can now:');
        console.log('1. Login as job seeker: amit@example.com / password123');
        console.log('2. Browse and apply for these jobs');
        console.log('3. Login as recruiter: rajesh@amritsar.com / recruiter123');
        console.log('4. View applications in recruiter dashboard\n');

        // Don't exit if required from another file
        if (require.main === module) {
            process.exit(0);
        }
    } catch (error) {
        console.error('❌ Error seeding jobs:', error);
        if (require.main === module) {
            process.exit(1);
        }
    }
}

// Run immediately if executed directly
if (require.main === module) {
    seedJobs();
} else {
    // Export for use in other files
    module.exports = seedJobs();
}
