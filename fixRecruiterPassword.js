const bcrypt = require('bcryptjs');
const { sequelize, User } = require('./models');

async function fixRecruiterPassword() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected');

        // Find the recruiter
        const recruiter = await User.findOne({
            where: { email: 'rajesh@amritsar.com' }
        });

        if (!recruiter) {
            console.log('❌ Recruiter not found!');
            process.exit(1);
        }

        console.log('✅ Recruiter found:', recruiter.email);

        // Hash the password manually
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('recruiter123', salt);
        
        // Update password directly without triggering hooks
        await sequelize.query(
            'UPDATE users SET password = ? WHERE id = ?',
            {
                replacements: [hashedPassword, recruiter.id],
                type: sequelize.QueryTypes.UPDATE
            }
        );

        console.log('✅ Password updated successfully!');

        // Verify the password
        const updatedRecruiter = await User.findByPk(recruiter.id);
        const isMatch = await bcrypt.compare('recruiter123', updatedRecruiter.password);
        
        console.log('\n🔑 Password verification:', isMatch ? '✅ VALID' : '❌ INVALID');

        if (isMatch) {
            console.log('\n✅ SUCCESS! You can now login with:');
            console.log('   Email: rajesh@amritsar.com');
            console.log('   Password: recruiter123');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

fixRecruiterPassword();
