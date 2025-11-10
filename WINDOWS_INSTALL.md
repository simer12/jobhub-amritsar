# 🪟 Windows Installation Guide - JobHub Amritsar

## Complete Step-by-Step Installation for Windows

### ⏱️ Estimated Time: 20-30 minutes

---

## Step 1: Install Node.js (5 minutes)

1. **Download Node.js**
   - Visit: https://nodejs.org
   - Download: "LTS" version (Recommended)
   - File size: ~30MB

2. **Install Node.js**
   - Run the downloaded installer
   - Click "Next" → "Next" → "Install"
   - ✅ Check "Automatically install necessary tools"
   - Complete installation

3. **Verify Installation**
   - Open PowerShell or Command Prompt
   - Run:
   ```powershell
   node --version
   npm --version
   ```
   - You should see version numbers (e.g., v18.17.0)

---

## Step 2: Install MongoDB (10 minutes)

### Option A: MongoDB Community Server (Recommended)

1. **Download MongoDB**
   - Visit: https://www.mongodb.com/try/download/community
   - Version: Latest stable
   - Package: MSI installer
   - File size: ~400MB

2. **Install MongoDB**
   - Run installer as Administrator
   - Choose "Complete" installation
   - ✅ Check "Install MongoDB as a Service"
   - ✅ Check "Install MongoDB Compass" (GUI tool)
   - Complete installation

3. **Verify MongoDB**
   - Open PowerShell as Administrator
   - Run:
   ```powershell
   mongod --version
   ```

4. **Start MongoDB Service**
   ```powershell
   net start MongoDB
   ```

### Option B: MongoDB Atlas (Cloud - Easier)

1. **Sign up for free**
   - Visit: https://www.mongodb.com/cloud/atlas
   - Create account

2. **Create Cluster**
   - Choose FREE tier (M0)
   - Select region: Mumbai (closest to Amritsar)
   - Create cluster (takes 3-5 minutes)

3. **Setup Access**
   - Database Access → Add User
   - Network Access → Add IP: `0.0.0.0/0`
   - Get connection string

---

## Step 3: Download Project Files

1. **Extract the ZIP**
   - Extract all files to: `C:\jobhub-amritsar\`
   - Or any folder you prefer

2. **Open in VS Code (Optional)**
   - Download VS Code: https://code.visualstudio.com
   - Open folder: File → Open Folder → Select `C:\jobhub-amritsar`

---

## Step 4: Install Project Dependencies (3 minutes)

1. **Open PowerShell**
   - Press `Win + X`
   - Select "Windows PowerShell" or "Terminal"

2. **Navigate to Project**
   ```powershell
   cd "C:\jobhub-amritsar"
   # Or wherever you extracted the files
   ```

3. **Install Dependencies**
   ```powershell
   npm install
   ```
   - This downloads all required packages
   - Wait for completion (2-3 minutes)

---

## Step 5: Configure Environment (2 minutes)

1. **Rename Environment File**
   ```powershell
   Rename-Item -Path "env" -NewName ".env"
   ```

2. **Edit .env File (if using MongoDB Atlas)**
   - Open `.env` in Notepad or VS Code
   - Update MongoDB URI:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jobhub_amritsar
   ```
   - Save file

---

## Step 6: Seed Database (Optional - 2 minutes)

1. **Make sure MongoDB is running**
   ```powershell
   # Check if MongoDB service is running
   Get-Service MongoDB
   
   # If not running, start it:
   net start MongoDB
   ```

2. **Seed Sample Data**
   ```powershell
   npm run seed
   ```

3. **You should see:**
   ```
   ✅ Created 5 employers
   ✅ Created 2 job seekers
   ✅ Created 8 jobs
   
   🔑 Login Credentials:
      Employer: rajesh@techAmr.com / password123
      Job Seeker: manpreet@example.com / password123
   ```

---

## Step 7: Start the Application (1 minute)

1. **Run Development Server**
   ```powershell
   npm run dev
   ```

2. **You should see:**
   ```
   🚀 ========================================
      JobHub Amritsar Server Running
      ========================================
      🌐 Server: http://localhost:5000
      📊 Environment: development
      📍 Location: Amritsar, Punjab
      ========================================
   
   ✅ MongoDB Connected Successfully
   ```

3. **Open Browser**
   - Navigate to: http://localhost:5000
   - You should see the JobHub homepage!

---

## Step 8: Test the Application (5 minutes)

### Test as Job Seeker

1. **Click "Sign Up"**
   - Name: Your Name
   - Email: test@example.com
   - Phone: 9876543210
   - Password: password123
   - Role: Job Seeker
   - Click "Sign Up"

2. **Explore Features**
   - Browse jobs
   - Search for jobs
   - Save/bookmark jobs
   - Apply for jobs
   - View profile

### Test as Employer (Using Seeded Account)

1. **Click "Login"**
   - Email: rajesh@techAmr.com
   - Password: password123

2. **Employer Features**
   - Post new job
   - View applications
   - Manage posted jobs

---

## 🎯 Quick Command Reference

### Start MongoDB
```powershell
net start MongoDB
```

### Stop MongoDB
```powershell
net stop MongoDB
```

### Start Development Server
```powershell
npm run dev
```

### Seed Database
```powershell
npm run seed
```

### Clear and Re-seed Database
```powershell
# Open MongoDB shell
mongosh
# Or if older version: mongo

# In MongoDB shell:
use jobhub_amritsar
db.dropDatabase()
exit

# Then re-seed
npm run seed
```

---

## 🔧 Troubleshooting

### Issue: "npm" is not recognized

**Solution:**
1. Restart PowerShell after Node.js installation
2. Or reinstall Node.js and check "Add to PATH"

### Issue: MongoDB connection failed

**Solutions:**
1. **Check if MongoDB is running:**
   ```powershell
   Get-Service MongoDB
   ```

2. **Start MongoDB service:**
   ```powershell
   net start MongoDB
   ```

3. **If service doesn't exist:**
   - Reinstall MongoDB
   - Choose "Install as Windows Service"

### Issue: Port 5000 already in use

**Solution:**
1. Change port in `.env`:
   ```env
   PORT=3000
   ```

2. Or kill process using port 5000:
   ```powershell
   netstat -ano | findstr :5000
   taskkill /PID <PID_NUMBER> /F
   ```

### Issue: Permission denied errors

**Solution:**
Run PowerShell as Administrator:
1. Right-click PowerShell
2. Select "Run as Administrator"

### Issue: Cannot run scripts (Execution Policy)

**Solution:**
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

---

## 📁 File Structure After Installation

```
C:\jobhub-amritsar\
├── node_modules\          # Installed packages (auto-generated)
├── controllers\           # Business logic
├── models\               # Database schemas
├── routes\               # API routes
├── middleware\           # Custom middleware
├── uploads\              # File uploads (auto-created)
├── index.html            # Frontend
├── styles.css            # Styling
├── script.js             # Frontend JavaScript
├── server.js             # Backend server
├── package.json          # Project config
├── .env                  # Environment variables
└── README.md             # Documentation
```

---

## 🚀 Next Steps

### 1. Explore the Code
- Open in VS Code
- Check `server.js` for backend
- Check `script.js` for frontend
- Explore API routes in `routes/` folder

### 2. Customize for Amritsar
- Add more local areas in `seedData.js`
- Add Punjabi translations
- Add local companies

### 3. Add Features
- Email notifications
- WhatsApp integration
- Payment gateway
- Mobile app

### 4. Deploy to Production
- Follow `DEPLOYMENT.md`
- Use MongoDB Atlas
- Deploy to Render/Railway/Heroku

---

## 📚 Additional Resources

### Documentation
- Full docs: `README.md`
- Quick start: `QUICKSTART.md`
- Deployment: `DEPLOYMENT.md`

### Video Tutorials
- Node.js basics: https://nodejs.org/en/docs/guides
- MongoDB tutorial: https://university.mongodb.com
- Express.js guide: https://expressjs.com/en/starter/installing.html

### Tools
- **MongoDB Compass**: GUI for MongoDB (installed with MongoDB)
- **Postman**: Test API endpoints (https://www.postman.com)
- **VS Code**: Code editor (https://code.visualstudio.com)

---

## ✅ Installation Checklist

- [ ] Node.js installed and verified
- [ ] MongoDB installed and running
- [ ] Project dependencies installed (`npm install`)
- [ ] Environment configured (`.env` file)
- [ ] Database seeded (`npm run seed`)
- [ ] Server running (`npm run dev`)
- [ ] Application accessible at http://localhost:5000
- [ ] Can register/login users
- [ ] Can browse jobs

---

## 🎉 Success!

If you can see the JobHub homepage and browse jobs, congratulations! 

You've successfully set up a complete, production-ready job portal for Amritsar!

**Need help?** Check the troubleshooting section or README.md

**Ready to deploy?** See DEPLOYMENT.md

**Happy coding! 🚀**

---

*Made with ❤️ for Amritsar, Punjab*
