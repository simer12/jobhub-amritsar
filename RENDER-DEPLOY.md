# 🚀 Deploy to Render.com (FREE FOREVER)

## ✨ Why Render?
- ✅ **100% FREE** - No credit card required
- ✅ **PostgreSQL Database** - Free included
- ✅ **Auto SSL** - HTTPS automatically
- ✅ **Auto Deploy** - Connect GitHub
- ✅ **750 hours/month** - Enough for 24/7

---

## 📦 Step-by-Step Deployment (5 Minutes)

### Step 1: Create GitHub Repository

```powershell
# Already initialized! Now push to GitHub:
# 1. Go to github.com and create new repository
# 2. Name it: jobhub-amritsar
# 3. Don't initialize with README (we already have files)
# 4. Copy the repository URL
```

### Step 2: Push to GitHub

```powershell
# Add your GitHub repository (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/jobhub-amritsar.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Deploy on Render

1. **Go to Render**: https://render.com
2. **Sign Up** with GitHub (free, no credit card)
3. **New → Web Service**
4. **Connect** your GitHub repository (jobhub-amritsar)
5. **Configure**:
   - **Name**: jobhub-amritsar
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: FREE

6. **Add Environment Variables** (click "Advanced"):
   ```
   NODE_ENV=production
   JWT_SECRET=jobhub-render-secret-key-2025
   JWT_EXPIRE=30d
   PORT=10000
   ```

7. **Click** "Create Web Service"

### Step 4: Add PostgreSQL Database (Optional)

1. In Render Dashboard, click **"New +"**
2. Select **"PostgreSQL"**
3. **Name**: jobhub-database
4. **Plan**: FREE
5. Click **"Create Database"**
6. Copy **Internal Database URL**
7. Go back to your Web Service → Environment
8. Add variable:
   ```
   DATABASE_URL=<paste-the-url>
   ```

### Step 5: Seed Database

Once deployed, run seed command:

1. Go to your Web Service in Render
2. Click **"Shell"** tab
3. Run:
   ```bash
   node seedData.js
   node createAdmin.js
   ```

---

## 🎉 Your App is Live!

Your app will be live at:
```
https://jobhub-amritsar.onrender.com
```

### Test It:
- **Homepage**: https://jobhub-amritsar.onrender.com
- **Admin Login**: admin@jobhub.com / admin123
- **Employer**: rajesh@techAmr.com / password123
- **Job Seeker**: manpreet@example.com / password123

---

## 🔄 Auto Deploy Updates

Every time you push to GitHub, Render automatically deploys!

```powershell
# Make changes
git add .
git commit -m "Update features"
git push origin main
# Render auto-deploys! 🎉
```

---

## 📊 Monitor Your App

- **Dashboard**: https://dashboard.render.com
- **Logs**: Click your service → "Logs" tab
- **Metrics**: "Metrics" tab shows CPU/Memory usage

---

## 🆓 Free Tier Limits

- ✅ 750 hours/month (enough for 24/7)
- ✅ Sleeps after 15 min inactivity
- ✅ Wakes up on first request (~30 seconds)
- ✅ PostgreSQL: 90 days free, then renew

**Tip**: Keep it active by using a free uptime monitor like UptimeRobot.com

---

## 🚨 Important Notes

1. **Cold Start**: Free apps sleep after 15 min. First request takes ~30 sec
2. **Database**: Free PostgreSQL expires after 90 days (just create new one)
3. **Custom Domain**: Supported on free tier!

---

## 🎯 Next Steps

1. ✅ Deploy to Render
2. ✅ Share your live URL
3. ✅ Add custom domain (optional)
4. ✅ Monitor with UptimeRobot (optional)
5. ✅ Collect feedback and improve!

---

**Made with ❤️ for Amritsar** 🇮🇳
