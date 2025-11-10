# 🚀 Deployment Guide - JobHub Amritsar

## Quick Deploy Options

### Option 1: Deploy to Render (Recommended - Free)

1. **Create account at [render.com](https://render.com)**

2. **Push code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

3. **Create MongoDB Atlas Database**
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create free cluster
   - Get connection string
   - Replace `<password>` with your password

4. **Deploy on Render**
   - Connect GitHub repository
   - Select "Web Service"
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add Environment Variables:
     ```
     NODE_ENV=production
     MONGODB_URI=<your-atlas-connection-string>
     JWT_SECRET=<generate-strong-secret>
     CLIENT_URL=<your-render-url>
     ```

### Option 2: Deploy to Railway (Free Tier)

1. **Install Railway CLI**
```powershell
npm i -g @railway/cli
```

2. **Login and Deploy**
```bash
railway login
railway init
railway up
```

3. **Add MongoDB Plugin**
```bash
railway add -p mongodb
```

4. **Set Environment Variables**
```bash
railway variables set JWT_SECRET=<your-secret>
railway variables set CLIENT_URL=<your-railway-url>
```

### Option 3: Deploy to Heroku

1. **Install Heroku CLI**
Download from [heroku.com](https://devcenter.heroku.com/articles/heroku-cli)

2. **Login and Create App**
```bash
heroku login
heroku create jobhub-amritsar
```

3. **Add MongoDB Addon**
```bash
heroku addons:create mongolab:sandbox
```

4. **Set Environment Variables**
```bash
heroku config:set JWT_SECRET=<your-secret>
heroku config:set CLIENT_URL=https://jobhub-amritsar.herokuapp.com
```

5. **Deploy**
```bash
git push heroku main
heroku open
```

## Production Checklist

### ✅ Before Deployment

- [ ] Update `.env` with production values
- [ ] Set strong JWT_SECRET
- [ ] Use MongoDB Atlas (not local MongoDB)
- [ ] Enable CORS for your domain only
- [ ] Test all API endpoints
- [ ] Remove console.logs from production code
- [ ] Add rate limiting for security
- [ ] Enable HTTPS

### ✅ Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jobhub_amritsar
JWT_SECRET=<64-character-random-string>
JWT_EXPIRE=7d
CLIENT_URL=https://your-domain.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### 🔐 Security Settings

1. **Generate Strong JWT Secret**
```javascript
require('crypto').randomBytes(64).toString('hex')
```

2. **Enable Helmet Security Headers**
Already configured in `server.js`

3. **Set up CORS**
```javascript
// In server.js
app.use(cors({
    origin: 'https://your-domain.com',
    credentials: true
}));
```

4. **Enable Rate Limiting**
Already configured in `server.js`

## MongoDB Atlas Setup

1. **Create Cluster**
   - Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create free M0 cluster
   - Choose region closest to Amritsar (Mumbai)

2. **Create Database User**
   - Security → Database Access
   - Add New User
   - Save username and password

3. **Whitelist IP**
   - Security → Network Access
   - Add IP: `0.0.0.0/0` (Allow from anywhere)

4. **Get Connection String**
   - Clusters → Connect
   - Connect your application
   - Copy connection string
   - Replace `<password>` with your password

## Domain Setup (Optional)

### Using Custom Domain

1. **Buy Domain** (GoDaddy, Namecheap, etc.)

2. **Configure DNS**
   - Add A Record pointing to your server IP
   - Or CNAME pointing to your hosting URL

3. **Update Environment**
```env
CLIENT_URL=https://www.jobhub-amritsar.com
```

### Free Subdomain Options
- Render: `jobhub-amritsar.onrender.com`
- Railway: `jobhub-amritsar.up.railway.app`
- Heroku: `jobhub-amritsar.herokuapp.com`

## Post-Deployment

### ✅ Verify Deployment

1. **Check Server**
```bash
curl https://your-domain.com/api/health
```

2. **Test API Endpoints**
```bash
# Get jobs
curl https://your-domain.com/api/jobs

# Register user
curl -X POST https://your-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","phone":"9876543210","password":"test123","role":"jobseeker"}'
```

3. **Monitor Logs**
```bash
# Render
View in dashboard

# Railway
railway logs

# Heroku
heroku logs --tail
```

### 🔧 Troubleshooting

**Database Connection Failed?**
- Verify MongoDB URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure password is URL encoded

**API Returns 404?**
- Check if server is running
- Verify environment variables are set
- Check route definitions

**CORS Errors?**
- Update CLIENT_URL in environment
- Check CORS configuration in server.js

## Maintenance

### Regular Updates
```bash
# Pull latest code
git pull origin main

# Install new dependencies
npm install

# Restart server
# (Automatic on most platforms)
```

### Database Backup
```bash
# Export from MongoDB Atlas
# Clusters → Collections → Export Collection
```

### Monitor Performance
- Use MongoDB Atlas monitoring
- Check server logs regularly
- Monitor API response times

## Scaling

### When to Scale?
- More than 1000 daily users
- Response time > 2 seconds
- High CPU/Memory usage

### How to Scale?

1. **Vertical Scaling**
   - Upgrade to paid tier
   - Increase RAM/CPU

2. **Horizontal Scaling**
   - Add load balancer
   - Deploy multiple instances
   - Use Redis for caching

3. **Database Scaling**
   - Upgrade MongoDB cluster
   - Add read replicas
   - Implement indexing

## Cost Estimates

### Free Tier (Good for starting)
- **Hosting:** Render/Railway/Heroku Free
- **Database:** MongoDB Atlas M0 Free
- **Total:** ₹0/month
- **Limits:** 512MB RAM, 500MB storage

### Paid Tier (For production)
- **Hosting:** Render ($7/month)
- **Database:** MongoDB Atlas M10 ($0.08/hr ≈ $57/month)
- **Total:** ~₹5,000/month
- **Features:** Custom domain, auto-scaling, backups

## Support

### Need Help?
- 📧 Email: support@jobhub-amritsar.com
- 📱 WhatsApp: +91 98765 43210
- 🌐 Website: www.jobhub-amritsar.com

### Resources
- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- [Heroku Docs](https://devcenter.heroku.com/)

---

**🎉 Ready to Deploy!**

Choose your platform, follow the steps, and your JobHub Amritsar portal will be live!

*Good luck! 🚀*
