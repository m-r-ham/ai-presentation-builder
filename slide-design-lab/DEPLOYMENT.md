# 🚀 Deployment Guide

## Vercel Deployment (Recommended)

### 1. Prepare Repository
```bash
# Commit all changes
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Connect your GitHub repository
3. Import the `slide-design-lab` directory
4. Configure environment variables:

**Required Environment Variables:**
```
OPENAI_API_KEY=your_openai_api_key
NODE_ENV=production
DATABASE_PATH=/tmp/slide_design_lab.db
ALLOWED_ORIGINS=https://your-app.vercel.app
```

### 3. Custom Build Settings
- **Build Command:** `npm run build`
- **Output Directory:** `frontend/dist`
- **Install Command:** `npm run install-all`

### 4. Serverless Functions
The API routes will automatically deploy as Vercel serverless functions via the `vercel.json` configuration.

## Alternative: Railway Deployment

### 1. Create Railway Project
```bash
npm install -g @railway/cli
railway login
railway init
```

### 2. Configure Environment
```bash
railway variables set OPENAI_API_KEY=your_key
railway variables set NODE_ENV=production
```

### 3. Deploy
```bash
railway up
```

## Alternative: Heroku Deployment

### 1. Create Heroku App
```bash
heroku create slide-design-lab
heroku config:set OPENAI_API_KEY=your_key
heroku config:set NODE_ENV=production
```

### 2. Deploy
```bash
git push heroku main
```

## 🌍 Making It Public

### DNS & Domain (Optional)
1. Purchase domain (e.g., `slidelab.ai`)
2. Configure in Vercel dashboard
3. Add custom domain to `ALLOWED_ORIGINS`

### Analytics & Monitoring
Add these services for production:
- **Analytics:** Vercel Analytics or Google Analytics
- **Error Tracking:** Sentry
- **Uptime Monitoring:** Uptime Robot

### Scaling Considerations
- **Database:** Consider PostgreSQL for high traffic
- **Rate Limiting:** Add rate limits to prevent abuse
- **Caching:** Cache slide generation results
- **CDN:** Use Vercel Edge Network automatically

## 🔧 Production Optimizations

### Backend Optimizations
```javascript
// Add to server.js
app.use(express.json({ limit: '10mb' }));
app.use(compression());
app.use(helmet());
```

### Frontend Optimizations
```javascript
// Add to vite.config.js
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        react: ['react', 'react-dom']
      }
    }
  }
}
```

## 📊 Monitoring Training Data

### Export Endpoint
```
GET https://your-app.vercel.app/api/analytics/export-for-main-app
```

Use this endpoint to regularly export training data to your main AI presentation builder.

### Database Backup
```bash
# Local backup
sqlite3 database/slide_design_lab.db ".backup backup.db"

# Production backup (add to cron job)
curl "https://your-app.vercel.app/api/analytics/export-for-main-app" > training_backup.json
```

## 🚦 Go Live Checklist

- [ ] Environment variables configured
- [ ] Database initialized
- [ ] CORS origins set correctly
- [ ] SSL certificate active
- [ ] Analytics tracking enabled
- [ ] Error monitoring setup
- [ ] Backup strategy implemented
- [ ] Integration endpoint tested

---

**Ready to collect crowd-sourced slide design training data!** 🎯