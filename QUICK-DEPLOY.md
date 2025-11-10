# 🚀 Quick Deploy Guide - JobHub Amritsar

## Fastest Way to Deploy (5 minutes!)

### Option 1: Render.com (Recommended - FREE)

1. **Go to** [render.com](https://render.com) and sign up

2. **Click** "New +" → "Web Service"

3. **Connect GitHub** (or deploy from this folder)

4. **Fill in:**
   - Name: `jobhub-amritsar`
   - Build Command: `npm install`
   - Start Command: `node server.js`

5. **Add Environment Variables:**
   ```
   NODE_ENV=production
   JWT_SECRET=jobhub-super-secret-key-2025
   JWT_EXPIRE=30d
   ```

6. **Click** "Create Web Service"

7. **Done!** Your app will be live at: `https://jobhub-amritsar.onrender.com`

---

### Option 2: Railway.app (Easiest - FREE)

1. **Go to** [railway.app](https://railway.app)

2. **Click** "Start a New Project" → "Deploy from GitHub repo"

3. **Select** this repository

4. **Add PostgreSQL** (optional but recommended)

5. **Environment Variables** (auto-detected from .env)

6. **Deploy!** Live in 2 minutes!

---

### Option 3: Vercel (For Static + API)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Production:**
   ```bash
   vercel --prod
   ```

---

## 📝 Before Deploying

### 1. Create .env file (if not exists):
```env
NODE_ENV=production
PORT=5000
JWT_SECRET=change-this-to-random-secret
JWT_EXPIRE=30d
```

### 2. Update package.json (already done):
```json
{
  "engines": {
    "node": ">=18.0.0"
  },
  "scripts": {
    "start": "node server.js"
  }
}
```

### 3. Test locally:
```bash
npm start
```

---

## 🎯 What Happens After Deploy?

✅ Your app will be live at a URL like:
- **Render**: `https://jobhub-amritsar.onrender.com`
- **Railway**: `https://jobhub-amritsar.up.railway.app`
- **Vercel**: `https://jobhub-amritsar.vercel.app`

✅ All features work:
- Job Seeker Dashboard
- Recruiter Dashboard  
- Admin Dashboard
- Job Applications
- Authentication

✅ Free SSL certificate (HTTPS)

✅ Auto-deploy on git push

---

## 🔧 After Deployment - Update API URL

In your `script.js`, `jobseeker-dashboard.js`, `recruiter-dashboard.js`, `admin-dashboard.js`:

```javascript
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : 'https://your-app.onrender.com/api';  // Change this!
```

Or make it dynamic:
```javascript
const API_URL = window.location.protocol + '//' + window.location.host + '/api';
```

---

## 🗄️ Database (Important!)

**SQLite works but not recommended for production.**

### Switch to PostgreSQL (Free on Railway/Render):

1. **Add PostgreSQL database** in your platform
2. **Get DATABASE_URL** (auto-provided)
3. **Install pg:**
   ```bash
   npm install pg pg-hstore
   ```
4. **Update server.js** (already handles DATABASE_URL)
5. **Re-run seed:**
   ```bash
   npm run seed
   ```

---

## 🎉 Your App is Live!

**Test Everything:**
- ✅ Homepage: `https://your-app.com`
- ✅ Login: Use test credentials
- ✅ Job Seeker Dashboard
- ✅ Recruiter Dashboard (rajesh@amritsar.com / recruiter123)
- ✅ Apply to jobs
- ✅ Post jobs

---

## 🆘 Common Issues

**Issue:** "Application failed to start"
- Check logs in platform dashboard
- Verify environment variables
- Ensure `npm install` ran successfully

**Issue:** "Database connection failed"  
- Add PostgreSQL database
- Check DATABASE_URL is set
- Re-run migrations

**Issue:** "API not responding"
- Check CORS settings
- Verify API_URL in frontend
- Check server logs

---

## 📞 Need Help?

1. Check platform logs
2. Verify all environment variables
3. Test locally first: `npm start`
4. Check DEPLOYMENT.md for detailed guide

---

**Ready to deploy? Choose a platform above and go live in 5 minutes!** 🚀
