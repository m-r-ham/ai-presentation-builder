# 🚀 Vercel Deployment Instructions

## Step 1: GitHub Repository Ready ✅
- **Commit Hash:** `d2728cd`
- **Repository:** https://github.com/m-r-ham/ai-presentation-builder
- **Directory:** `slide-design-lab/`

## Step 2: Deploy to Vercel

### Option A: Vercel Dashboard (Recommended)
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import from GitHub: `m-r-ham/ai-presentation-builder`
4. **Important:** Set root directory to `slide-design-lab`
5. Configure environment variables (see below)
6. Deploy!

### Option B: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from slide-design-lab directory
cd slide-design-lab
vercel --prod
```

## Step 3: Environment Variables

**Set these in Vercel Dashboard > Settings > Environment Variables:**

```
OPENAI_API_KEY=your_openai_api_key_from_openai_dashboard
NODE_ENV=production
DATABASE_PATH=/tmp/slide_design_lab.db
ALLOWED_ORIGINS=https://slide-design-lab.vercel.app,http://localhost:5174
```

## Step 4: Build Settings

**If prompted, use these settings:**
- **Build Command:** `cd frontend && npm install && npm run build`
- **Output Directory:** `frontend/dist`
- **Install Command:** `npm install && cd backend && npm install && cd ../frontend && npm install`
- **Root Directory:** `slide-design-lab`

## Step 5: Verify Deployment

Once deployed, test these endpoints:
- **Frontend:** `https://your-app.vercel.app`
- **API Health:** `https://your-app.vercel.app/api/health`
- **Slide Generation:** `https://your-app.vercel.app/api/generate/categories`

## Step 6: Update CORS Origins

After getting your Vercel URL, update the environment variable:
```
ALLOWED_ORIGINS=https://your-actual-vercel-url.vercel.app,http://localhost:5174
```

## 🎯 Expected Result

**Live Slide Design Lab** where users can:
- Enter slide prompts
- Get 3 AI-generated versions
- Rate slides on 6 design dimensions
- Provide feedback with Keep/Kill/Revise decisions
- Contribute to training data for the main AI presentation builder

## 🔗 Integration Ready

The deployed lab will have an export endpoint:
```
GET https://your-app.vercel.app/api/analytics/export-for-main-app
```

Use this to feed training data back to your main presentation builder!

---

**Ready to collect crowd-sourced slide design training data!** 🧪✨