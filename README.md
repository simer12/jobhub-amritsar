# JobHub Amritsar - Complete End-to-End Job Portal

![JobHub Logo](https://via.placeholder.com/800x200/6366f1/ffffff?text=JobHub+Amritsar+-+Your+Dream+Job+Awaits)

## 🌟 About

**JobHub Amritsar** is a comprehensive, full-stack job portal specifically designed for the Amritsar job market. It connects local job seekers with employers, featuring modern UI, real-time notifications, and Amritsar-specific features like local area mapping and Punjabi language support.

## ✨ Features

### For Job Seekers
- 🔍 **Advanced Job Search** - Filter by location, salary, experience, job type
- 📱 **Mobile Responsive** - Works seamlessly on all devices
- 🔖 **Save Jobs** - Bookmark jobs for later
- 📄 **Resume Upload** - Upload and manage your resume
- 🎯 **AI-Powered Recommendations** - Get personalized job matches
- 📊 **Application Tracking** - Track all your applications
- 🔔 **Real-time Notifications** - Get instant job alerts
- 🗣️ **Multi-language Support** - English, Hindi, Punjabi

### For Employers
- 📝 **Post Jobs** - Easy job posting interface
- 👥 **Manage Applications** - Review and manage applicants
- 📈 **Analytics Dashboard** - Track job performance
- 🎯 **Applicant Filtering** - Filter by skills, experience
- 📧 **Communication Tools** - Message applicants directly
- 🔍 **Candidate Search** - Find suitable candidates
- 📊 **Hiring Analytics** - Data-driven hiring decisions

### Amritsar-Specific Features
- 📍 **Local Area Mapping** - Jobs mapped to Amritsar localities
- 🗣️ **Punjabi Language** - Full Punjabi interface support
- 🏢 **Local Companies Database** - Verified Amritsar employers
- 🚗 **Local Transportation** - Jobs with location details
- 🎓 **Local Institutions** - Partner with local colleges

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with glassmorphism
- **JavaScript (ES6+)** - Interactive features
- **Font Awesome** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Relational Database
- **Sequelize** - ORM (Object-Relational Mapping)
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### Additional Tools
- **Multer** - File uploads
- **Nodemailer** - Email notifications
- **Helmet** - Security
- **Morgan** - Logging
- **Express Validator** - Input validation

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MySQL (via XAMPP recommended)
- npm or yarn

### Step 1: Install XAMPP
Download and install XAMPP from: https://www.apachefriends.org
Start MySQL in XAMPP Control Panel

### Step 2: Create Database
Open phpMyAdmin (http://localhost/phpmyadmin)
Create database: `jobhub_amritsar`

### Step 3: Clone the Repository
```bash
git clone <your-repo-url>
cd jobhub-amritsar
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Setup
Create a `.env` file in the root directory:
```bash
cp env .env
```

Edit `.env` with your configuration:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jobhub_amritsar
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5000
```

### Step 4: Start MongoDB
Make sure MongoDB is running:
```bash
# Windows
mongod

# Mac/Linux
sudo systemctl start mongod
```

### Step 5: Seed Database (Optional)
Populate database with sample Amritsar jobs:
```bash
npm run seed
```

This creates:
- 5 Amritsar-based employers
- 2 sample job seekers
- 8 Amritsar-specific jobs

### Step 6: Start the Server
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Server will run at: **http://localhost:5000**

## 🚀 Usage

### Access the Portal
Open your browser and navigate to:
```
http://localhost:5000
```

### Test Accounts

#### Employer Account
- **Email:** rajesh@techAmr.com
- **Password:** password123
- Can post jobs, manage applications

#### Job Seeker Account
- **Email:** manpreet@example.com
- **Password:** password123
- Can apply for jobs, save jobs

### API Endpoints

#### Authentication
```
POST   /api/auth/register       - Register new user
POST   /api/auth/login          - Login user
GET    /api/auth/me             - Get current user
PUT    /api/auth/updateprofile  - Update profile
POST   /api/auth/logout         - Logout user
```

#### Jobs
```
GET    /api/jobs                - Get all jobs
GET    /api/jobs/:id            - Get single job
POST   /api/jobs                - Create job (Employer)
PUT    /api/jobs/:id            - Update job (Employer)
DELETE /api/jobs/:id            - Delete job (Employer)
GET    /api/jobs/amritsar       - Get Amritsar jobs
POST   /api/jobs/:id/save       - Save job (Job Seeker)
```

#### Applications
```
POST   /api/applications/:jobId        - Apply for job
GET    /api/applications/my-applications - Get user applications
GET    /api/applications/job/:jobId    - Get job applications (Employer)
PUT    /api/applications/:id/status    - Update application status
PUT    /api/applications/:id/interview - Schedule interview
```

#### Dashboard
```
GET    /api/dashboard/employer    - Employer dashboard
GET    /api/dashboard/jobseeker   - Job seeker dashboard
GET    /api/dashboard/analytics   - Analytics data
```

## 📁 Project Structure

```
jobhub-amritsar/
├── controllers/           # Request handlers
│   ├── authController.js
│   ├── jobController.js
│   ├── applicationController.js
│   ├── userController.js
│   ├── companyController.js
│   └── dashboardController.js
├── middleware/           # Custom middleware
│   ├── auth.js          # JWT authentication
│   └── upload.js        # File upload
├── models/              # Database models
│   ├── User.js
│   ├── Job.js
│   └── Application.js
├── routes/              # API routes
│   ├── auth.js
│   ├── jobs.js
│   ├── applications.js
│   ├── users.js
│   ├── companies.js
│   └── dashboard.js
├── uploads/             # Uploaded files
│   ├── resumes/
│   ├── profiles/
│   └── companies/
├── index.html           # Main frontend file
├── styles.css           # Styling
├── script.js            # Frontend JavaScript
├── server.js            # Server entry point
├── seedData.js          # Database seeding
├── package.json         # Dependencies
├── .env                 # Environment variables
└── README.md           # This file
```

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ HTTP security headers (Helmet)
- ✅ Rate limiting
- ✅ Input validation
- ✅ CORS protection
- ✅ XSS protection
- ✅ File upload validation

## 🌐 Amritsar-Specific Data

### Covered Areas
- Ranjit Avenue
- Lawrence Road
- Mall Road
- Chheharta
- Majitha Road
- GT Road
- Hall Bazaar
- Court Road
- Model Town
- And more...

### Job Categories
- IT & Software
- Retail & Sales
- Hospitality & Tourism
- Education & Training
- Healthcare
- Manufacturing
- And 10+ more categories

## 📊 Database Schema

### Users Collection
- Basic info (name, email, phone)
- Role (jobseeker/employer/admin)
- Profile data (skills, experience, education)
- Company data (for employers)
- Location preferences
- Language preferences

### Jobs Collection
- Job details
- Company information
- Location (Amritsar areas)
- Requirements
- Salary range
- Application tracking

### Applications Collection
- Job seeker reference
- Job reference
- Employer reference
- Application status
- Interview details
- Communication history

## 🔧 Configuration

### Email Setup (Optional)
Configure email in `.env`:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### File Upload Limits
Modify in `.env`:
```env
MAX_FILE_SIZE=5242880  # 5MB
```

### Rate Limiting
Configure in `.env`:
```env
RATE_LIMIT_WINDOW=15  # minutes
RATE_LIMIT_MAX_REQUESTS=100
```

## 🚀 Deployment

### Deploy to Heroku
```bash
heroku create jobhub-amritsar
heroku addons:create mongolab
git push heroku main
heroku open
```

### Deploy to Vercel/Netlify
1. Build frontend assets
2. Set environment variables
3. Deploy backend to Heroku/Railway
4. Deploy frontend to Vercel/Netlify

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=<your-mongodb-atlas-uri>
JWT_SECRET=<strong-secret-key>
CLIENT_URL=<your-frontend-url>
```

## 📝 API Documentation

Full API documentation available at:
```
http://localhost:5000/api/health
```

### Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "count": 10,
  "total": 100
}
```

### Error Format
```json
{
  "success": false,
  "message": "Error message",
  "error": {}
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

For support, email: support@jobhub-amritsar.com

## 📱 Contact

- **Website:** www.jobhub-amritsar.com
- **Email:** info@jobhub-amritsar.com
- **Phone:** +91 98765 43210
- **Address:** Ranjit Avenue, Amritsar, Punjab

## 🎯 Future Enhancements

- [ ] WhatsApp integration for notifications
- [ ] SMS alerts
- [ ] Video interviews
- [ ] AI-powered resume screening
- [ ] Mobile apps (iOS/Android)
- [ ] Payment gateway for premium features
- [ ] Advanced analytics
- [ ] Employer verification system
- [ ] Skill assessment tests
- [ ] Virtual job fairs

## 📜 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Font Awesome for icons
- MongoDB team
- Express.js community
- All contributors

---

**Made with ❤️ for the people of Amritsar, Punjab**

*Connecting talent with opportunity in the Holy City*
