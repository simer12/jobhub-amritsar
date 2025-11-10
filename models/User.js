const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    phone: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('jobseeker', 'employer'),
        allowNull: false,
        defaultValue: 'jobseeker'
    },
    
    // Job Seeker Fields
    skills: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    experience: {
        type: DataTypes.STRING(20)
    },
    education: {
        type: DataTypes.STRING(50)
    },
    resume: {
        type: DataTypes.STRING(255)
    },
    profilePicture: {
        type: DataTypes.STRING(255)
    },
    bio: {
        type: DataTypes.TEXT
    },
    preferredJobType: {
        type: DataTypes.STRING(20)
    },
    expectedSalary: {
        type: DataTypes.JSON
    },
    savedJobs: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    
    // Employer Fields
    companyName: {
        type: DataTypes.STRING(100)
    },
    companySize: {
        type: DataTypes.STRING(20)
    },
    companyType: {
        type: DataTypes.STRING(50)
    },
    companyDescription: {
        type: DataTypes.TEXT
    },
    companyWebsite: {
        type: DataTypes.STRING(255)
    },
    companyLogo: {
        type: DataTypes.STRING(255)
    },
    
    // Common Fields
    currentLocation: {
        type: DataTypes.STRING(100)
    },
    localArea: {
        type: DataTypes.STRING(100)
    },
    languagesKnown: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    lastLogin: {
        type: DataTypes.DATE
    },
    resetPasswordToken: {
        type: DataTypes.STRING(255)
    },
    resetPasswordExpire: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'users',
    timestamps: true,
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

// Instance method to compare password
User.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = User;
