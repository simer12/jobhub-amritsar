const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();
const { connectDB } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const userRoutes = require('./routes/users');
const applicationRoutes = require('./routes/applications');
const companyRoutes = require('./routes/companies');
const dashboardRoutes = require('./routes/dashboard');
const adminRoutes = require('./routes/admin');

const app = express();

// ==================== MIDDLEWARE ====================

// Trust proxy - required for Railway and rate limiting
app.set('trust proxy', 1);

// Security headers
app.use(helmet({
    contentSecurityPolicy: false, // Disable for development, enable in production
}));

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Static files
app.use(express.static(path.join(__dirname)));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==================== API ROUTES ====================
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);

// ==================== SERVE FRONTEND ====================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API Health Check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'JobHub Amritsar API is running',
        timestamp: new Date(),
        environment: process.env.NODE_ENV
    });
});

// ==================== ERROR HANDLING ====================

// 404 Handler
app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
        res.status(404).json({
            success: false,
            message: 'API endpoint not found'
        });
    } else {
        next();
    }
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;

// Initialize database and then start server
const startServer = async () => {
    try {
        // Connect to database and sync tables
        await connectDB();
        console.log('✅ Database initialized');
        
        // Start server
        app.listen(PORT, async () => {
            console.log('\n🚀 ========================================');
            console.log(`   JobHub Amritsar Server Running`);
            console.log('   ========================================');
            console.log(`   🌐 Server: http://localhost:${PORT}`);
            console.log(`   📊 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`   📍 Location: Amritsar, Punjab`);
            console.log('   ========================================\n');
            
            // Auto-seed database if empty (for Render/Vercel deployments)
            try {
                const { User } = require('./models');
                const userCount = await User.count();
                console.log(`📊 Current users in database: ${userCount}`);
                
                if (userCount === 0) {
                    console.log('🌱 Database empty. Running auto-seed...');
                    const autoSeed = require('./autoSeed');
                    await autoSeed();
                    console.log('✅ Auto-seed completed!');
                } else {
                    console.log('✅ Database has data, skipping seed');
                }
            } catch (error) {
                console.error('⚠️ Auto-seed check failed:', error.message);
            }
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Start the server
startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err);
    process.exit(1);
});

module.exports = app;
