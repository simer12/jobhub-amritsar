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
        
        // Sync models - force recreation in production to ensure schema is updated
        // This fixes ENUM changes (like adding 'admin' role)
        const shouldForceSync = process.env.FORCE_DB_SYNC === 'true';
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
