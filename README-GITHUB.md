# 🚀 JobHub Amritsar - Complete Job Portal

A modern, full-featured job portal specifically designed for Amritsar, Punjab. Connect local job seekers with employers through an intuitive platform with separate dashboards for job seekers, recruiters, and administrators.

![JobHub Banner](https://via.placeholder.com/1200x300/6366f1/ffffff?text=JobHub+Amritsar+-+Your+Dream+Job+Awaits)

## ✨ Features

### For Job Seekers
- 📝 Create and manage professional profile
- 🔍 Browse and search local jobs in Amritsar
- 📨 Apply to jobs with one click
- 📊 Track application status in real-time
- 💾 Save favorite jobs
- 📄 Upload and manage resume
- 🗓️ Interview scheduling
- 🔔 Real-time notifications

### For Recruiters
- 🏢 Post and manage job listings
- 👥 View and manage applicants
- ⭐ Shortlist candidates
- 📅 Schedule interviews
- 📈 Analytics dashboard
- 💼 Company profile management
- 📊 Application tracking

### For Administrators
- 👨‍💼 Manage all users (job seekers & recruiters)
- 📋 Oversee all job postings
- 📊 Platform analytics and reports
- ⚙️ System settings and configuration
- 📝 Content management
- 🔍 Activity logs

## 🛠️ Tech Stack

**Frontend:**
- HTML5, CSS3, JavaScript (ES6+)
- Responsive Design (Mobile-first)
- Glassmorphism UI
- Font Awesome Icons

**Backend:**
- Node.js v18+
- Express.js
- Sequelize ORM
- SQLite (Development) / PostgreSQL (Production)

**Authentication:**
- JWT (JSON Web Tokens)
- Bcrypt password hashing
- Role-based access control

**Security:**
- Helmet.js
- CORS protection
- Rate limiting
- Input validation
- XSS protection

## 📦 Installation

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/jobhub-amritsar.git
   cd jobhub-amritsar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```env
   NODE_ENV=development
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=30d
   ```

4. **Seed database with sample data**
   ```bash
   npm run seed
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:5000
   ```

## 👥 Test Credentials

### Job Seeker
- Email: `amit@example.com`
- Password: `password123`

### Recruiter
- Email: `rajesh@amritsar.com`
- Password: `recruiter123`

### Admin
- Email: `admin@jobhub.com`
- Password: `admin123`

## 🚀 Deployment

### Deploy to Render (Recommended)
```bash
# See QUICK-DEPLOY.md for detailed instructions
```

### Deploy to Railway
```bash
# One-click deploy from GitHub
```

### Deploy to Vercel
```bash
npm i -g vercel
vercel
```

For detailed deployment instructions, see [QUICK-DEPLOY.md](QUICK-DEPLOY.md)

## 📁 Project Structure

```
jobhub-amritsar/
├── config/              # Configuration files
├── controllers/         # Route controllers
├── middleware/          # Custom middleware
├── models/             # Database models
├── routes/             # API routes
├── public/             # Static files
├── uploads/            # File uploads
├── *.html              # Frontend pages
├── *.js                # Frontend scripts
├── *.css               # Stylesheets
├── server.js           # Express server
├── seedData.js         # Database seeder
└── package.json        # Dependencies
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (Recruiter)
- `PUT /api/jobs/:id` - Update job (Recruiter)
- `DELETE /api/jobs/:id` - Delete job (Recruiter)
- `GET /api/jobs/my-jobs` - Get recruiter's jobs

### Applications
- `POST /api/applications/:jobId` - Apply to job
- `GET /api/applications/my-applications` - Get user's applications
- `GET /api/applications/employer-applications` - Get recruiter's applications
- `PUT /api/applications/:id/status` - Update application status
- `DELETE /api/applications/:id` - Withdraw application

## 🎨 Features Showcase

### Dashboard Screenshots
- **Job Seeker Dashboard**: Profile, Browse Jobs, Applications, Resume Upload
- **Recruiter Dashboard**: Post Jobs, Manage Applicants, Analytics
- **Admin Dashboard**: User Management, Platform Analytics, Reports

### Key Highlights
✅ Fully responsive design  
✅ Real-time updates  
✅ Secure authentication  
✅ Role-based access control  
✅ File upload support  
✅ Advanced job filtering  
✅ Application tracking  
✅ Interview scheduling  

## 🔐 Security Features

- JWT authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- Input validation
- XSS protection
- Helmet security headers
- SQL injection prevention

## 🌟 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**JobHub Team**
- Website: [jobhub-amritsar.onrender.com](https://jobhub-amritsar.onrender.com)
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Built with ❤️ for Amritsar job seekers and employers
- Special thanks to the local tech community
- Icons by Font Awesome
- UI inspiration from modern job portals

## 📞 Support

For support, email support@jobhub.com or join our Slack channel.

## 🗺️ Roadmap

- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Video interviews
- [ ] Resume parser (AI)
- [ ] Job recommendations (ML)
- [ ] Multi-language support (Punjabi, Hindi)
- [ ] Payment integration
- [ ] Company verification
- [ ] Advanced analytics

---

**Made with ❤️ in Amritsar, Punjab** 🇮🇳
