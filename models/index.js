const { sequelize } = require('../config/database');
const User = require('./User');
const Job = require('./Job');
const Application = require('./Application');

// Define Associations
User.hasMany(Job, { 
    foreignKey: 'companyId', 
    as: 'jobs',
    onDelete: 'CASCADE'
});
Job.belongsTo(User, { 
    foreignKey: 'companyId', 
    as: 'company'
});

User.hasMany(Application, { 
    foreignKey: 'applicantId', 
    as: 'applications',
    onDelete: 'CASCADE'
});
Application.belongsTo(User, { 
    foreignKey: 'applicantId', 
    as: 'applicant'
});

User.hasMany(Application, { 
    foreignKey: 'employerId', 
    as: 'receivedApplications',
    onDelete: 'CASCADE'
});
Application.belongsTo(User, { 
    foreignKey: 'employerId', 
    as: 'employer'
});

Job.hasMany(Application, { 
    foreignKey: 'jobId', 
    as: 'applications',
    onDelete: 'CASCADE'
});
Application.belongsTo(Job, { 
    foreignKey: 'jobId', 
    as: 'job'
});

module.exports = {
    sequelize,
    User,
    Job,
    Application
};
