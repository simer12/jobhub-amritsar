# 🚂 Railway Deployment Guide - JobHub Amritsar

## ✨ Why Railway?
- ✅ **FREE** - $5 credit/month (enough for small projects)
- ✅ **Auto SSL** - HTTPS automatically
- ✅ **PostgreSQL** - Free database included
- ✅ **Auto Deploy** - Push to GitHub = Auto deploy
- ✅ **No Credit Card** - Required for free tier

---

## 🚀 Method 1: Direct Upload (2 Minutes - Easiest!)

### Step-by-Step:

1. **Go to Railway** (already opened for you)
   - URL: https://railway.app

2. **Sign Up/Login**
   - Click "Login" → "Login with GitHub"
   - Or use Email

3. **Create New Project**
   - Click "New Project"
   - Select "Empty Project"

4. **Add Service**
   - Click "+ New"
   - Select "GitHub Repo"
   - If you haven't pushed to GitHub yet, select "Empty Service"

5. **Deploy from Local (If not using GitHub)**
   - Install Railway CLI:
     ```bash
     npm install -g @railway/cli
     ```
   - Login:
     ```bash
     railway login
     ```
   - Link project:
     ```bash
     railway link
     ```
   - Deploy:
     ```bash
     railway up
     ```

6. **Configure Environment Variables**
   - In Railway Dashboard → Your Service
   - Click "Variables" tab
   - Add:
     ```
     NODE_ENV=production
     JWT_SECRET=jobhub-railway-secret-2025-amritsar
     JWT_EXPIRE=30d
     PORT=3000
     ```

7. **Add PostgreSQL Database (Optional but Recommended)**
   - Click "+ New" in your project
   - Select "Database"
   - Choose "PostgreSQL"
   - Railway auto-connects it to your app!

8. **Get Your Live URL**
   - Go to "Settings" tab
   - Click "Generate Domain"
   - Your app is live at: `https://your-app.up.railway.app`

---

## 🚀 Method 2: Deploy from GitHub (Best for Updates)

### Step 1: Push to GitHub

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - JobHub Amritsar"

# Create GitHub repo (go to github.com/new)
# Then add remote:
git remote add origin https://github.com/YOUR-USERNAME/jobhub-amritsar.git

# Push
git branch -M main
git push -u origin main
```

### Step 2: Connect to Railway

1. **Go to Railway** → "New Project"
2. **Select** "Deploy from GitHub repo"
3. **Choose** your jobhub-amritsar repository
4. **Configure** (Railway auto-detects Node.js)
5. **Add Environment Variables** (as above)
6. **Add PostgreSQL** (optional)
7. **Deploy!** - Automatic!

---

## 📦 What Railway Does Automatically:

✅ Detects Node.js  
✅ Runs `npm install`  
✅ Starts with `node server.js`  
✅ Provides SSL certificate  
✅ Assigns a domain  
✅ Sets up environment variables  
✅ Connects PostgreSQL database  

---

## 🗄️ Database Setup (PostgreSQL)

### Add PostgreSQL:

1. In Railway project, click "+ New"
2. Select "PostgreSQL"
3. Railway creates database and sets `DATABASE_URL`

### Update Your Code (Already done if using our code):

The server.js already checks for `DATABASE_URL`:
```javascript
// Automatically uses PostgreSQL if DATABASE_URL exists
// Otherwise uses SQLite for local development
```

### Seed the Database:

After deployment:
```bash
railway run npm run seed
```

Or add a seed command in Railway:
- Settings → Deploy → Add "Seed Command"
- Command: `npm run seed`

---

## 🔧 Environment Variables

**Required Variables:**

```env
NODE_ENV=production
JWT_SECRET=your-super-secret-key-change-this-123456
JWT_EXPIRE=30d
```

**Optional Variables:**

```env
PORT=3000
DATABASE_URL=postgresql://... (Auto-set by Railway)
FRONTEND_URL=https://your-app.up.railway.app
```

---

## 🌐 Custom Domain (Optional)

### Add Custom Domain:

1. Go to your service in Railway
2. Click "Settings" → "Domains"
3. Click "Add Domain"
4. Enter your domain (e.g., jobhub.in)
5. Update DNS records:
   ```
   Type: CNAME
   Name: @
   Value: your-app.up.railway.app
   ```

---

## 📊 Monitor Your App

### View Logs:
- Railway Dashboard → Your Service → "Deployments"
- Click on active deployment → "View Logs"

### Check Metrics:
- Railway Dashboard → "Metrics" tab
- See CPU, Memory, Network usage

---

## 🚀 Deploy Updates

### If using GitHub:
```bash
git add .
git commit -m "Update: description of changes"
git push origin main
```
Railway auto-deploys! 🎉

### If using Railway CLI:
```bash
railway up
```

---

## ✅ Post-Deployment Checklist

After deployment:

1. **Test the URL**
   - Visit: `https://your-app.up.railway.app`
   - Should see JobHub homepage

2. **Test Login**
   - Try job seeker login: amit@example.com / password123
   - Try recruiter login: rajesh@amritsar.com / recruiter123

3. **Seed Database** (if using PostgreSQL)
   ```bash
   railway run npm run seed
   ```

4. **Update Frontend URLs**
   - All dashboards should automatically use production URL
   - Check `script.js` - API_URL should be dynamic

5. **Test All Features**
   - ✅ Sign up
   - ✅ Login
   - ✅ Browse jobs
   - ✅ Apply to job
   - ✅ Recruiter dashboard
   - ✅ Post new job

---

## 🆘 Troubleshooting

### Issue: "Application failed to start"

**Solution:**
- Check logs in Railway dashboard
- Verify environment variables are set
- Ensure `npm install` completed successfully

### Issue: "Database connection failed"

**Solution:**
- Add PostgreSQL database in Railway
- Verify `DATABASE_URL` is set automatically
- Run seed command: `railway run npm run seed`

### Issue: "API not responding"

**Solution:**
- Check if service is running (green dot in Railway)
- View logs for errors
- Verify PORT is set correctly

### Issue: "Can't access from custom domain"

**Solution:**
- Verify DNS records are correct
- Wait 24-48 hours for DNS propagation
- Check Railway domain settings

---

## 💰 Railway Pricing

**Free Tier:**
- $5/month in credits
- Perfect for small projects
- Enough for JobHub with moderate traffic

**Pro Plan** ($20/month):
- $20 credit included
- Better for production
- Priority support

---

## 📞 Need Help?

1. **Railway Docs**: https://docs.railway.app
2. **Railway Discord**: https://discord.gg/railway
3. **Check Logs**: Railway Dashboard → Logs
4. **Email Support**: help@railway.app

---

## 🎉 Success!

Once deployed, your app is live at:
**https://jobhub-amritsar.up.railway.app**

Share it with:
- Job seekers in Amritsar
- Local employers
- Friends and family

---

**Your JobHub is now LIVE! 🎊**

Next steps:
1. ✅ Share the URL
2. ✅ Add custom domain (optional)
3. ✅ Monitor usage
4. ✅ Collect feedback
5. ✅ Keep improving!

---

Made with ❤️ in Amritsar, Punjab 🇮🇳
