const { sequelize, User, Job } = require('./models');
const autoSeed = require('./autoSeed');
require('dotenv').config();

const forceSeed = async () => {
    try {
        console.log('🔄 Force seeding database...');
        
        // Drop all tables and recreate
        await sequelize.sync({ force: true });
        console.log('✅ Database tables recreated');
        
        // Run auto seed
        await autoSeed();
        console.log('✅ Database seeded successfully');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Force seed failed:', error);
        process.exit(1);
    }
};

forceSeed();
