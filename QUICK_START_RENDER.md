# Quick Start: Deploy to Render.com

## 🚀 Fastest Path to Deployment

### Step 1: Connect Repository (2 minutes)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Blueprint"
3. Connect GitHub and select `marcobfenda/jmonline`
4. Render will auto-detect `render.yaml`

### Step 2: Configure Services (5 minutes)

#### Option A: Use Blueprint (Easiest)
- Render will create services from `render.yaml`
- You'll need to add environment variables manually

#### Option B: Manual Setup

**1. Backend API Service:**
- Type: Web Service
- Environment: Docker
- Dockerfile Path: `backend/Dockerfile`
- Docker Context: `backend`

**2. Frontend Static Site:**
- Type: Static Site  
- Build Command: `cd frontend && npm install && npm run build`
- Publish Directory: `frontend/build`

**3. Database:**
- Choose PostgreSQL (Render's default) OR external MySQL
- See `database/README.md` for options

### Step 3: Set Environment Variables (3 minutes)

**Backend API Service:**
```
DB_HOST=<your-database-host>
DB_NAME=jmonline
DB_USER=jmonline_user
DB_PASS=<your-database-password>
PHP_VERSION=8.2
```

**Frontend Static Site:**
```
REACT_APP_API_URL=https://your-api-service.onrender.com/api
```

### Step 4: Initialize Database (5 minutes)

1. Connect to your database
2. Run `database/init.sql`
3. Run migration files in order
4. (Optional) Run `seed_categories.sql`

### Step 5: Deploy! 🎉

- Services will auto-deploy on every push to `main`
- Check deployment logs in Render dashboard
- Your app will be live at:
  - Frontend: `https://jmonline-frontend.onrender.com`
  - Backend: `https://jmonline-api.onrender.com`

## ⚠️ Important Notes

1. **Database Choice**: Render uses PostgreSQL. You can:
   - Adapt code to PostgreSQL (recommended)
   - Use external MySQL service (PlanetScale, Aiven, etc.)

2. **CORS**: Already configured in `backend/.htaccess`

3. **File Uploads**: `uploads/` directory is created during build

4. **Auto-Deploy**: Enabled by default on `main` branch

## 📚 Full Documentation

See `RENDER_DEPLOYMENT.md` for detailed instructions.

## 🆘 Troubleshooting

- **Build fails?** Check logs in Render dashboard
- **Database connection issues?** Verify environment variables
- **CORS errors?** Check `.htaccess` configuration
- **Frontend can't reach API?** Verify `REACT_APP_API_URL` is correct

