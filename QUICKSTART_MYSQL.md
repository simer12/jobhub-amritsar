# 🚀 QUICK START - JobHub Amritsar (MySQL Version)

## ⚡ Get Running in 10 Minutes!

---

## Step 1: Install XAMPP (5 minutes)

1. Download XAMPP: https://www.apachefriends.org/download.html
2. Install it (keep clicking Next)
3. Open XAMPP Control Panel
4. Click **"Start"** next to **MySQL**
5. Click **"Start"** next to **Apache** (for phpMyAdmin)

✅ **Done!** MySQL is running

---

## Step 2: Create Database (1 minute)

1. Open browser: **http://localhost/phpmyadmin**
2. Click **"New"** (left sidebar)
3. Database name: **`jobhub_amritsar`**
4. Click **"Create"**

✅ **Done!** Database created

---

## Step 3: Setup Project (3 minutes)

Open PowerShell and run:

```powershell
# Navigate to project
cd "C:\Users\LENOVO\Desktop\New folder (9)"

# Install dependencies (already done!)
# npm install

# Create .env file
Copy-Item env .env

# Seed database with sample data
npm run seed

# Start server
npm run dev
```

✅ **Done!** Server running

---

## Step 4: Open & Test (1 minute)

1. Open browser: **http://localhost:5000**

2. Click **"Sign In"**

3. Login as Employer:
   - Email: **rajesh@techAmr.com**
   - Password: **password123**

4. Or Login as Job Seeker:
   - Email: **manpreet@example.com**
   - Password: **password123**

✅ **Done!** You're in!

---

## ✅ Verification

You should see:

### In Terminal:
```
✅ MySQL Connected Successfully
📍 Database: jobhub_amritsar
🚀 JobHub Amritsar Server Running
🌐 Server: http://localhost:5000
```

### In Browser:
- Beautiful job portal homepage
- 8 Amritsar jobs listed
- Search functionality working
- Login/signup working

---

## 🎯 What You Have Now

- ✅ **5 Amritsar Employers** (TechAmr, Retail Hub, Hotels, EduTech, Healthcare)
- ✅ **2 Job Seekers** (with profiles and skills)
- ✅ **8 Jobs** (IT, Retail, Hospitality, Education, Healthcare, Marketing, Delivery, Accounting)
- ✅ **Complete job portal** with search, filters, applications, dashboard

---

## 🛠️ Useful Commands

### Start Server:
```powershell
npm run dev
```

### Reseed Database (fresh data):
```powershell
npm run seed
```

### Stop Server:
Press `Ctrl + C` in terminal

### Check Database:
Open: http://localhost/phpmyadmin
Click on: `jobhub_amritsar`

---

## 🐛 Troubleshooting

### Issue: "Can't connect to MySQL"
**Solution:** Make sure MySQL is started in XAMPP Control Panel

### Issue: "Database doesn't exist"
**Solution:** Create it in phpMyAdmin: http://localhost/phpmyadmin

### Issue: "Port 5000 already in use"
**Solution:** Change PORT in .env file to 3000 or 8000

### Issue: "npm run seed fails"
**Solution:** 
1. Make sure MySQL is running
2. Check database exists
3. Check .env file has correct DB settings

---

## 📂 Project Structure

```
New folder (9)/
├── index.html          # Frontend
├── styles.css          # Styling
├── script.js           # Frontend JS
├── server.js           # Backend server
├── .env                # Configuration
├── package.json        # Dependencies
├── seedData.js         # Sample data
├── config/
│   └── database.js     # MySQL connection
├── models/
│   ├── User.js         # User model
│   ├── Job.js          # Job model
│   ├── Application.js  # Application model
│   └── index.js        # Model relationships
├── controllers/        # Business logic
├── routes/             # API endpoints
└── middleware/         # Auth & upload
```

---

## 🎮 Try These Features

### As Employer:
1. ✅ Login: rajesh@techAmr.com / password123
2. ✅ Post a new job
3. ✅ View applications
4. ✅ Update application status
5. ✅ View dashboard analytics

### As Job Seeker:
1. ✅ Login: manpreet@example.com / password123
2. ✅ Search jobs
3. ✅ Save/bookmark jobs
4. ✅ Apply for jobs
5. ✅ Track applications

---

## 📚 Documentation

For more details, read:
- **MYSQL_SETUP.md** - Complete MySQL setup guide
- **MYSQL_CONVERSION.md** - What changed from MongoDB
- **README.md** - Full project documentation
- **WINDOWS_INSTALL.md** - Windows-specific guide

---

## ⚙️ .env Configuration

Your `.env` file should have:

```env
NODE_ENV=development
PORT=5000

# MySQL Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=jobhub_amritsar
DB_USER=root
DB_PASSWORD=

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_2024
JWT_EXPIRE=7d
```

---

## 🎉 Success Indicators

✅ XAMPP shows MySQL as "Running" (green)
✅ `npm run seed` completes without errors
✅ `npm run dev` shows "MySQL Connected Successfully"
✅ http://localhost:5000 loads the homepage
✅ Can login with test credentials
✅ Can see 8 jobs on homepage
✅ Search and filters work
✅ phpMyAdmin shows 3 tables with data

---

## 🚀 Next Steps

1. ✅ Explore all features
2. ✅ Post your own jobs
3. ✅ Customize company info
4. ✅ Add more Amritsar areas
5. ✅ Add Punjabi translations
6. ✅ Deploy to production (see DEPLOYMENT.md)
7. ✅ Launch in Amritsar market!

---

## 💡 Tips

- **XAMPP must be running** for the app to work
- **Don't close XAMPP Control Panel** while using the app
- **Check phpMyAdmin** to see your data visually
- **Use Postman** to test API endpoints
- **Read error messages** - they're helpful!

---

**Made with ❤️ for Amritsar, Punjab**

## 🎯 You're All Set!

**Enjoy your job portal!** 🎉

Need help? Check the documentation files or error messages for guidance.
