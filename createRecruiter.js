const bcrypt = require('bcryptjs');
const { sequelize, User, Job } = require('./models');

async function createRecruiterAndAssignJobs() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected');

        // Create recruiter account
        const hashedPassword = await bcrypt.hash('recruiter123', 10);
        
        const recruiter = await User.create({
            name: 'Rajesh Kumar',
            email: 'rajesh@amritsar.com',
            phone: '9876543210',
            password: hashedPassword,
            role: 'employer',
            companyName: 'TechHub Amritsar',
            companySize: '50-200',
            companyType: 'IT Services',
            companyDescription: 'Leading IT company in Amritsar providing software development and consulting services',
            companyWebsite: 'https://techhubamritsar.com',
            currentLocation: 'Amritsar',
            localArea: 'Ranjit Avenue',
            isVerified: true,
            isActive: true
        });

        console.log('✅ Recruiter created:', recruiter.email);
        console.log('📧 Email: rajesh@amritsar.com');
        console.log('🔑 Password: recruiter123');
        console.log('🏢 Company: TechHub Amritsar');

        // Get all jobs
        const jobs = await Job.findAll();
        console.log(`\n📊 Found ${jobs.length} jobs in database`);

        // Update all jobs to belong to this recruiter
        const updateResult = await Job.update(
            { 
                companyId: recruiter.id,
                companyName: recruiter.companyName
            },
            { where: {} } // Update all jobs
        );

        console.log(`✅ Updated ${updateResult[0]} jobs to belong to ${recruiter.companyName}`);

        // Verify the update
        const recruiterJobs = await Job.findAll({
            where: { companyId: recruiter.id }
        });

        console.log(`\n✅ Verification: Recruiter now has ${recruiterJobs.length} jobs`);
        console.log('\n📋 Jobs assigned:');
        recruiterJobs.forEach((job, index) => {
            console.log(`   ${index + 1}. ${job.title} - ${job.location}`);
        });

        console.log('\n🎉 Done! You can now login as recruiter with:');
        console.log('   Email: rajesh@amritsar.com');
        console.log('   Password: recruiter123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

createRecruiterAndAssignJobs();
