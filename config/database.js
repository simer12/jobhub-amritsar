const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

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
        console.log('📍 Database File:', path.join(__dirname, '..', 'database.sqlite'));
        
        // In production on first deploy, force recreate to fix ENUM schema
        // Check if we need to force sync by trying to query users table
        let needsForceSync = false;
        try {
            const { User } = require('../models');
            // Try to create a test admin user to see if role ENUM has 'admin'
            const testResult = await sequelize.query(
                "SELECT sql FROM sqlite_master WHERE type='table' AND name='users'",
                { type: sequelize.QueryTypes.SELECT }
            );
            
            if (testResult.length > 0) {
                const tableSchema = testResult[0].sql;
                // Check if role ENUM includes 'admin'
                if (!tableSchema.includes("'admin'")) {
                    console.log('⚠️ Old schema detected - role ENUM missing admin. Forcing sync...');
                    needsForceSync = true;
                }
            }
        } catch (err) {
            console.log('ℹ️ Cannot check schema, will sync normally');
        }
        
        // Sync models - force recreation if needed
        const shouldForceSync = process.env.FORCE_DB_SYNC === 'true' || needsForceSync;
        await sequelize.sync({ force: shouldForceSync });
        
        if (shouldForceSync) {
            console.log('✅ Database tables recreated (force sync enabled)');
        } else {
            console.log('✅ Database tables synchronized (created missing tables if any)');
        }

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
