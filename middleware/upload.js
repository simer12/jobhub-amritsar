const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        let folder = 'uploads/';
        
        if (file.fieldname === 'resume') {
            folder = 'uploads/resumes/';
        } else if (file.fieldname === 'profilePicture') {
            folder = 'uploads/profiles/';
        } else if (file.fieldname === 'companyLogo') {
            folder = 'uploads/companies/';
        }
        
        // Create folder if it doesn't exist
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
        
        cb(null, folder);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    // Allowed file types
    const allowedTypes = {
        resume: ['.pdf', '.doc', '.docx'],
        profilePicture: ['.jpg', '.jpeg', '.png', '.gif'],
        companyLogo: ['.jpg', '.jpeg', '.png', '.svg']
    };
    
    const ext = path.extname(file.originalname).toLowerCase();
    const fieldName = file.fieldname;
    
    if (allowedTypes[fieldName] && allowedTypes[fieldName].includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type. Allowed types for ${fieldName}: ${allowedTypes[fieldName]?.join(', ')}`), false);
    }
};

// Upload middleware
const upload = multer({
    storage: storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
    },
    fileFilter: fileFilter
});

module.exports = upload;
