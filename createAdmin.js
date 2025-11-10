const { User } = require('./models');
require('dotenv').config();

const createAdmin = async () => {
    try {
        console.log('🔧 Creating admin user...');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ 
            where: { email: 'admin@jobhub.com' } 
        });

        if (existingAdmin) {
            console.log('⚠️ Admin user already exists!');
            console.log('Email:', existingAdmin.email);
            console.log('Role:', existingAdmin.role);
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create({
            name: 'Admin',
            email: 'admin@jobhub.com',
            phone: '9999999999',
            password: 'admin123',
            role: 'admin',
            languagesKnown: ['English', 'Hindi', 'Punjabi'],
            currentLocation: 'Amritsar',
            isVerified: true
        });

        console.log('✅ Admin user created successfully!');
        console.log('\n🔑 Admin Login Credentials:');
        console.log('   Email: admin@jobhub.com');
        console.log('   Password: admin123');
        console.log('\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
        console.error(error);
        process.exit(1);
    }
};

createAdmin();
