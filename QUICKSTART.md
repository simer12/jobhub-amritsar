# 🚀 Quick Start Guide - JobHub Amritsar

## Prerequisites Check
Before starting, ensure you have:
- ✅ Node.js installed (v14+) - Check: `node --version`
- ✅ MongoDB installed (v4.4+) - Check: `mongod --version`
- ✅ npm installed - Check: `npm --version`

## Installation Steps (5 Minutes)

### 1️⃣ Install Dependencies
```powershell
npm install
```
This will install all required packages (Express, MongoDB, JWT, etc.)

### 2️⃣ Setup Environment
Rename `env` to `.env`:
```powershell
Rename-Item -Path "env" -NewName ".env"
```

The `.env` file is pre-configured for local development. No changes needed!

### 3️⃣ Start MongoDB
Open a new PowerShell/CMD window and run:
```powershell
mongod
```
Keep this window open while using the application.

### 4️⃣ Seed Sample Data (Optional but Recommended)
```powershell
npm run seed
```

This creates:
- 5 Amritsar-based companies (TechAmr Solutions, Retail Hub, etc.)
- 2 sample users (1 employer, 1 job seeker)
- 8 real Amritsar jobs (IT, Retail, Healthcare, Education, etc.)

### 5️⃣ Start the Server
```powershell
npm run dev
```

You should see:
```
🚀 ========================================
   JobHub Amritsar Server Running
   ========================================
   🌐 Server: http://localhost:5000
   📊 Environment: development
   📍 Location: Amritsar, Punjab
   ========================================
```

### 6️⃣ Open in Browser
Navigate to: **http://localhost:5000**

## 🎯 Test the Application

### As Job Seeker
1. Click "Sign Up" button
2. Fill the form:
   - Name: Your Name
   - Email: your@email.com
   - Phone: 9876543210
   - Password: password123
   - Select: "Job Seeker"
3. Login with your credentials
4. Browse jobs, save jobs, apply for jobs

### As Employer (Using Seeded Data)
1. Click "Login" button
2. Use seeded credentials:
   - Email: `rajesh@techAmr.com`
   - Password: `password123`
3. Post new jobs, manage applications

## 📱 Key Features to Try

### For Job Seekers:
- ✅ Search jobs with filters
- ✅ Save/bookmark jobs
- ✅ Apply for jobs
- ✅ Upload resume
- ✅ Track applications
- ✅ Update profile

### For Employers:
- ✅ Post new jobs
- ✅ View applications
- ✅ Manage applicants
- ✅ Schedule interviews
- ✅ View analytics

## 🗺️ Amritsar Features

The portal includes real Amritsar locations:
- Ranjit Avenue
- Mall Road
- Lawrence Road
- Court Road
- Chheharta
- And 15+ more areas

Jobs are categorized by:
- IT & Software (TechAmr Solutions)
- Retail (Retail Hub Amritsar)
- Hospitality (Golden Temple Hospitality)
- Education (EduTech Learning Center)
- Healthcare (Health Plus Clinic)

## 🔧 Troubleshooting

### MongoDB Connection Error?
```powershell
# Start MongoDB service
net start MongoDB
```

### Port Already in Use?
Change PORT in `.env`:
```env
PORT=3000
```

### Module Not Found?
```powershell
# Reinstall dependencies
Remove-Item -Recurse -Force node_modules
npm install
```

### Clear Database & Re-seed
```powershell
# In MongoDB shell
mongo
use jobhub_amritsar
db.dropDatabase()
exit

# Then re-run seed
npm run seed
```

## 📊 API Testing

Use tools like Postman or curl:

### Get All Jobs
```bash
curl http://localhost:5000/api/jobs
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9876543210",
    "password": "password123",
    "role": "jobseeker"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "rajesh@techAmr.com",
    "password": "password123"
  }'
```

## 🎓 Learning Resources

### MongoDB Basics
- Database: `jobhub_amritsar`
- Collections: `users`, `jobs`, `applications`
- View data: Use MongoDB Compass or Robo 3T

### Project Structure
```
📂 Models (Database Schemas)
   ├── User.js - User data
   ├── Job.js - Job postings
   └── Application.js - Job applications

📂 Controllers (Business Logic)
   ├── authController.js - Login/Register
   ├── jobController.js - Job CRUD
   └── applicationController.js - Applications

📂 Routes (API Endpoints)
   ├── auth.js - /api/auth/*
   ├── jobs.js - /api/jobs/*
   └── applications.js - /api/applications/*
```

## 🚀 Next Steps

1. **Customize for Your Needs**
   - Add more Amritsar areas in `seedData.js`
   - Modify job categories
   - Add more sample companies

2. **Enhance Features**
   - Add email notifications
   - Implement WhatsApp alerts
   - Add payment gateway

3. **Deploy to Production**
   - Use MongoDB Atlas for database
   - Deploy to Heroku/Railway/Render
   - Setup custom domain

## 📞 Need Help?

- Check `README.md` for detailed documentation
- Review API endpoints in route files
- Check console for error messages
- Verify MongoDB is running

## ✅ Success Indicators

You're ready when:
- ✅ Server starts without errors
- ✅ Can open http://localhost:5000
- ✅ Can register/login
- ✅ Can see jobs on homepage
- ✅ Database has seeded data

## 🎉 Congratulations!

You now have a fully functional job portal running locally!

**Happy Coding! 🚀**

---

*For detailed API documentation, see README.md*
*For production deployment, see DEPLOYMENT.md*
