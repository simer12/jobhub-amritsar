const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Database path
const dbPath = path.join(__dirname, '..', 'database.sqlite');

// In production, delete old database to force schema recreation (one-time fix for ENUM)
if (process.env.NODE_ENV === 'production' && process.env.RESET_DB === 'true') {
    try {
        if (fs.existsSync(dbPath)) {
            fs.unlinkSync(dbPath);
            console.log('🗑️ Old database deleted - will recreate with new schema');
        }
    } catch (err) {
        console.log('ℹ️ Could not delete old database:', err.message);
    }
}

// Create Sequelize instance with SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'database.sqlite'),
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
        timestamps: true,
        underscored: false
    }
});

// Test database connection
const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ SQLite Database Connected Successfully');
        console.log('📍 Database File:', dbPath);
        
        // Sync models - this will create tables with correct schema
        await sequelize.sync();
        console.log('✅ Database tables synchronized');

        // Ensure new permission columns exist on applications table. Some deployments
        // may have an older schema; add missing columns using QueryInterface.
        const qi = sequelize.getQueryInterface();
        let tableInfo = null;
        try {
            tableInfo = await qi.describeTable('applications');
        } catch (err) {
            console.log('ℹ️ applications table not found yet, syncing models and retrying...');
            await sequelize.sync();
            tableInfo = await qi.describeTable('applications');
        }

        const missingCols = [];
        const addIfMissing = async (name, definition) => {
            if (!tableInfo[name]) {
                try {
                    await qi.addColumn('applications', name, definition);
                    missingCols.push(name);
                    console.log(`➕ Added missing column to applications: ${name}`);
                } catch (err) {
                    console.error(`❌ Failed to add column ${name}:`, err.message || err);
                }
            }
        };

        // Add permission-related columns if absent
        await addIfMissing('detailsAccessRequested', { type: Sequelize.DataTypes.BOOLEAN, defaultValue: false });
        await addIfMissing('detailsAccessGranted', { type: Sequelize.DataTypes.BOOLEAN, defaultValue: false });
        await addIfMissing('detailsAccessRequestedAt', { type: Sequelize.DataTypes.DATE });
        await addIfMissing('detailsAccessGrantedAt', { type: Sequelize.DataTypes.DATE });
        await addIfMissing('detailsAccessGrantedBy', { type: Sequelize.DataTypes.INTEGER });

        if (missingCols.length === 0) {
            console.log('✅ applications table already has all permission columns');
        } else {
            console.log('✅ Added missing application columns:', missingCols.join(', '));
        }
    } catch (error) {
        console.error('❌ Database Connection Error:', error);
        process.exit(1);
    }
};

module.exports = { sequelize, connectDB };
