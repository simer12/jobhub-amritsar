const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Job = sequelize.define('Job', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    requirements: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    responsibilities: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    companyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    companyName: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    location: {
        type: DataTypes.JSON,
        allowNull: false
    },
    jobType: {
        type: DataTypes.ENUM('fulltime', 'parttime', 'contract', 'internship'),
        allowNull: false,
        defaultValue: 'fulltime'
    },
    workMode: {
        type: DataTypes.ENUM('office', 'remote', 'hybrid'),
        allowNull: false,
        defaultValue: 'office'
    },
    category: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    experienceRequired: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    educationRequired: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    skills: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    salary: {
        type: DataTypes.JSON,
        allowNull: false
    },
    vacancies: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    languagesRequired: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    benefits: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    status: {
        type: DataTypes.ENUM('active', 'closed', 'draft'),
        defaultValue: 'active'
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isFeatured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isUrgent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    applicationCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    tags: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    expiryDate: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'jobs',
    timestamps: true
});

// Instance method to increment views
Job.prototype.incrementViews = async function() {
    this.views += 1;
    await this.save();
};

module.exports = Job;
