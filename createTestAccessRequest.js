const { Application } = require('./models');
require('dotenv').config();

// Script to create a test access request
const createTestRequest = async () => {
    try {
        console.log('🔍 Looking for applications...');
        
        // Find an existing application
        const app = await Application.findOne();
        
        if (!app) {
            console.log('❌ No applications found. Please apply for a job first.');
            process.exit(0);
        }
        
        console.log(`✅ Found application #${app.id}`);
        
        // Mark it as having an access request
        app.detailsAccessRequested = true;
        app.detailsAccessRequestedAt = new Date();
        await app.save();
        
        console.log('✅ Access request created successfully!');
        console.log('\nNow login as admin and check the Access Requests page.');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

// Connect to database and run
const { sequelize } = require('./models');
sequelize.authenticate()
    .then(() => {
        console.log('✅ Database connected');
        return createTestRequest();
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err.message);
        process.exit(1);
    });
