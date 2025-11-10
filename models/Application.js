const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Application = sequelize.define('Application', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    jobId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'jobs',
            key: 'id'
        }
    },
    applicantId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    employerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    coverLetter: {
        type: DataTypes.TEXT
    },
    resume: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: 'No resume provided'
    },
    status: {
        type: DataTypes.ENUM('pending', 'reviewing', 'shortlisted', 'rejected', 'interview_scheduled', 'hired'),
        defaultValue: 'pending'
    },
    statusHistory: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    interviewDate: {
        type: DataTypes.DATE
    },
    interviewLocation: {
        type: DataTypes.STRING(255)
    },
    interviewNotes: {
        type: DataTypes.TEXT
    },
    employerNotes: {
        type: DataTypes.TEXT
    },
    rating: {
        type: DataTypes.INTEGER,
        validate: {
            min: 1,
            max: 5
        }
    },
    detailsAccessRequested: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    detailsAccessGranted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    detailsAccessRequestedAt: {
        type: DataTypes.DATE
    },
    detailsAccessGrantedAt: {
        type: DataTypes.DATE
    },
    detailsAccessGrantedBy: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, {
    tableName: 'applications',
    timestamps: true
});

// Instance method to update status
Application.prototype.updateStatus = async function(newStatus, note = '') {
    const history = this.statusHistory || [];
    history.push({
        status: newStatus,
        note: note,
        timestamp: new Date()
    });
    this.statusHistory = history;
    this.status = newStatus;
    await this.save();
};

module.exports = Application;
