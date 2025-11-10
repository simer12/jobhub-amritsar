const bcrypt = require('bcryptjs');
const { sequelize, User } = require('./models');

async function checkRecruiter() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected');

        // Find the recruiter
        const recruiter = await User.findOne({
            where: { email: 'rajesh@amritsar.com' }
        });

        if (!recruiter) {
            console.log('❌ Recruiter not found!');
            console.log('Creating recruiter now...');
            
            const hashedPassword = await bcrypt.hash('recruiter123', 10);
            const newRecruiter = await User.create({
                name: 'Rajesh Kumar',
                email: 'rajesh@amritsar.com',
                phone: '9876543210',
                password: hashedPassword,
                role: 'employer',
                companyName: 'TechHub Amritsar',
                companySize: '50-200',
                companyType: 'IT Services',
                companyDescription: 'Leading IT company in Amritsar',
                companyWebsite: 'https://techhubamritsar.com',
                currentLocation: 'Amritsar',
                localArea: 'Ranjit Avenue',
                isVerified: true,
                isActive: true
            });
            console.log('✅ Recruiter created:', newRecruiter.email);
        } else {
            console.log('✅ Recruiter found:', recruiter.email);
            console.log('   Name:', recruiter.name);
            console.log('   Role:', recruiter.role);
            console.log('   Company:', recruiter.companyName);
            console.log('   ID:', recruiter.id);
            
            // Test password
            const testPassword = 'recruiter123';
            const isMatch = await bcrypt.compare(testPassword, recruiter.password);
            console.log(`\n🔑 Password test for "${testPassword}":`, isMatch ? '✅ VALID' : '❌ INVALID');
            
            if (!isMatch) {
                console.log('\n⚠️  Password mismatch! Resetting password...');
                const newHashedPassword = await bcrypt.hash('recruiter123', 10);
                await recruiter.update({ password: newHashedPassword });
                console.log('✅ Password reset successfully!');
            }
        }

        console.log('\n📝 Login credentials:');
        console.log('   Email: rajesh@amritsar.com');
        console.log('   Password: recruiter123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkRecruiter();
