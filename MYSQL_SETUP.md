# 🎉 JobHub Amritsar - MySQL Version Setup Guide

## ✅ What Changed

Your job portal now uses **MySQL** instead of MongoDB!

- ✅ Replaced Mongoose with Sequelize ORM
- ✅ Updated all models for MySQL
- ✅ Created proper relationships with foreign keys
- ✅ JSON fields for arrays and objects
- ✅ Auto-incrementing IDs
- ✅ Timestamps (createdAt, updatedAt)

---

## 🚀 Quick Setup (3 Options)

### **Option 1: XAMPP (Easiest - Recommended)**

1. **Download XAMPP:**
   - Go to: https://www.apachefriends.org/download.html
   - Download for Windows
   - Install it

2. **Start MySQL:**
   - Open XAMPP Control Panel
   - Click "Start" next to MySQL
   - Click "Start" next to Apache (optional, for phpMyAdmin)

3. **Create Database:**
   - Open browser: http://localhost/phpmyadmin
   - Click "New" database
   - Name: `jobhub_amritsar`
   - Collation: `utf8mb4_general_ci`
   - Click "Create"

4. **Run Your App:**
   ```powershell
   cd "C:\Users\LENOVO\Desktop\New folder (9)"
   npm install
   npm run seed
   npm run dev
   ```

---

### **Option 2: MySQL Installer**

1. **Download MySQL:**
   - Go to: https://dev.mysql.com/downloads/installer/
   - Download MySQL Installer for Windows
   - Run installer

2. **Installation:**
   - Choose "Developer Default"
   - Set root password (or leave empty)
   - Complete installation

3. **Create Database:**
   ```powershell
   # Open MySQL Command Line Client
   mysql -u root -p
   
   # Create database
   CREATE DATABASE jobhub_amritsar;
   exit;
   ```

4. **Update .env:**
   ```
   DB_PASSWORD=your_mysql_password
   ```

5. **Run Your App:**
   ```powershell
   npm install
   npm run seed
   npm run dev
   ```

---

### **Option 3: Online MySQL (Free)**

Use **FreeSQLDatabase.com** or **db4free.net**:

1. Go to: https://www.freesqldatabase.com/
2. Sign up (free)
3. Get database credentials:
   - Host
   - Database name
   - Username
   - Password

4. **Update .env:**
   ```
   DB_HOST=sql12.freesqldatabase.com
   DB_PORT=3306
   DB_NAME=your_db_name
   DB_USER=your_username
   DB_PASSWORD=your_password
   ```

5. **Run Your App:**
   ```powershell
   npm install
   npm run seed
   npm run dev
   ```

---

## 📦 Install Dependencies

```powershell
cd "C:\Users\LENOVO\Desktop\New folder (9)"
npm install
```

This installs:
- `mysql2` - MySQL driver
- `sequelize` - ORM for MySQL
- All other dependencies

---

## 🗄️ Database Schema

### **Tables Created:**

1. **users**
   - id (INT, Primary Key, Auto Increment)
   - name, email, phone, password
   - role (jobseeker/employer)
   - Job seeker fields: skills, experience, resume
   - Employer fields: companyName, companySize, etc.
   - Amritsar fields: localArea, languagesKnown
   - createdAt, updatedAt

2. **jobs**
   - id (INT, Primary Key, Auto Increment)
   - title, description, requirements (JSON)
   - companyId (Foreign Key → users.id)
   - location (JSON)
   - salary (JSON)
   - skills (JSON)
   - status (active/closed/draft)
   - createdAt, updatedAt

3. **applications**
   - id (INT, Primary Key, Auto Increment)
   - jobId (Foreign Key → jobs.id)
   - applicantId (Foreign Key → users.id)
   - employerId (Foreign Key → users.id)
   - status (pending/reviewing/shortlisted/rejected/hired)
   - statusHistory (JSON)
   - createdAt, updatedAt

---

## 🌱 Seed Sample Data

```powershell
npm run seed
```

This creates:
- ✅ 5 Amritsar employers
- ✅ 2 job seekers
- ✅ 8 Amritsar jobs

---

## 🎯 Start Application

```powershell
npm run dev
```

Open: **http://localhost:5000**

---

## 🔐 Test Login

**Employer:**
```
Email: rajesh@techAmr.com
Password: password123
```

**Job Seeker:**
```
Email: manpreet@example.com
Password: password123
```

---

## ⚙️ Environment Variables (.env)

Update your `.env` file:

```env
# MySQL Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=jobhub_amritsar
DB_USER=root
DB_PASSWORD=

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_2024
JWT_EXPIRE=7d

# App Settings
NODE_ENV=development
PORT=5000
```

---

## 📊 Check Database

### Using phpMyAdmin (XAMPP):
1. Open: http://localhost/phpmyadmin
2. Click on `jobhub_amritsar` database
3. See all tables

### Using MySQL Command Line:
```sql
mysql -u root -p

USE jobhub_amritsar;

SHOW TABLES;

SELECT * FROM users;
SELECT * FROM jobs;
SELECT * FROM applications;
```

---

## 🛠️ Useful Commands

### Check if MySQL is running:
```powershell
Get-Process mysqld
```

### Start MySQL (XAMPP):
- Open XAMPP Control Panel
- Click "Start" for MySQL

### Restart database:
```powershell
npm run seed
```
This drops and recreates all tables with fresh data.

---

## 🐛 Troubleshooting

### Error: "Access denied for user 'root'@'localhost'"
**Solution:** Update DB_PASSWORD in .env

### Error: "Unknown database 'jobhub_amritsar'"
**Solution:** Create the database:
```sql
CREATE DATABASE jobhub_amritsar;
```

### Error: "connect ECONNREFUSED"
**Solution:** Make sure MySQL is running in XAMPP

### Port 3306 already in use:
**Solution:** Stop other MySQL services

---

## ✅ Verification Checklist

- [ ] MySQL installed (XAMPP or MySQL Installer)
- [ ] MySQL service running
- [ ] Database `jobhub_amritsar` created
- [ ] `.env` file configured with DB credentials
- [ ] `npm install` completed
- [ ] `npm run seed` successful
- [ ] `npm run dev` running
- [ ] http://localhost:5000 opens
- [ ] Can login with test credentials

---

## 🎉 Advantages of MySQL

- ✅ **Easier Installation** - XAMPP includes everything
- ✅ **phpMyAdmin** - Visual database management
- ✅ **Better Relations** - Foreign keys, ACID compliance
- ✅ **Widespread Support** - Most hosting supports MySQL
- ✅ **Free Hosting** - Many free MySQL hosts available
- ✅ **Familiar** - Most developers know SQL
- ✅ **Windows Friendly** - No compatibility issues

---

## 🚀 Next Steps

1. Install XAMPP
2. Start MySQL
3. Create database
4. Run `npm install`
5. Run `npm run seed`
6. Run `npm run dev`
7. Open http://localhost:5000
8. **Start using your job portal!**

---

**Made with ❤️ for Amritsar, Punjab**
*Now powered by MySQL!*
