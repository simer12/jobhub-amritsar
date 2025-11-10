# ⚡ Deploy to Vercel (FREE FOREVER)

## ✨ Why Vercel?
- ✅ **100% FREE** forever
- ✅ **No credit card** needed
- ✅ **Fastest** deployment
- ✅ **Global CDN**
- ✅ **Auto SSL**

---

## 🚀 Deploy in 2 Minutes

### Option 1: Deploy via Vercel CLI (FASTEST)

```powershell
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from project directory)
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? jobhub-amritsar
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

### Option 2: Deploy via GitHub

1. **Push to GitHub** (if not already):
   ```powershell
   git remote add origin https://github.com/YOUR-USERNAME/jobhub-amritsar.git
   git push -u origin main
   ```

2. **Go to Vercel**: https://vercel.com
3. **Sign up** with GitHub (free)
4. **New Project**
5. **Import** your GitHub repository
6. **Configure**:
   - Framework Preset: Other
   - Build Command: `npm install`
   - Output Directory: (leave empty)
7. **Environment Variables**:
   ```
   NODE_ENV=production
   JWT_SECRET=jobhub-vercel-secret-2025
   JWT_EXPIRE=30d
   ```
8. **Deploy!**

---

## 🗄️ Database Options for Vercel

### Option 1: Vercel Postgres (FREE)
```powershell
# In your Vercel project dashboard
# Go to Storage → Create Database → Postgres
# Free tier: 256MB, 60 hours compute/month
```

### Option 2: PlanetScale (FREE)
- Go to https://planetscale.com
- Create free MySQL database
- Copy connection URL
- Add to Vercel env vars: `DATABASE_URL`

### Option 3: MongoDB Atlas (FREE)
- Go to https://mongodb.com/cloud/atlas
- Create free cluster (512MB)
- Get connection string
- Add to Vercel: `MONGODB_URI`

---

## 🎉 Your App is Live!

```
https://jobhub-amritsar.vercel.app
```

### Custom Domain (FREE):
1. Vercel Dashboard → Your Project
2. Settings → Domains
3. Add your domain
4. Update DNS records

---

## 🔄 Auto Deploy

Push to GitHub = Auto deploy! ⚡

```powershell
git add .
git commit -m "Updates"
git push origin main
# Deployed instantly! 🎉
```

---

## 📊 Free Tier Features

- ✅ **Unlimited** websites
- ✅ **100GB** bandwidth/month
- ✅ **No sleep** - always instant
- ✅ **Serverless Functions**
- ✅ **Edge Network**
- ✅ **Custom domains**

---

## 🚨 Important Notes

1. **Serverless**: Functions have 10-second timeout on free tier
2. **No Always-On DB**: Need external database
3. **Best for**: API + Static files

---

**Super Fast Deployment! ⚡** 🇮🇳
