# Render.com Deployment Guide

This guide will help you deploy the JM Online application to Render.com.

## Prerequisites

1. A Render.com account (you already have one)
2. GitHub repository connected to Render
3. Basic understanding of environment variables

## Deployment Steps

### 1. Connect Your GitHub Repository

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Blueprint"
3. Connect your GitHub account if not already connected
4. Select the repository: `marcobfenda/jmonline`
5. Render will automatically detect the `render.yaml` file

### 2. Manual Service Setup (Alternative to Blueprint)

If you prefer to set up services manually:

#### A. Create Database

**Important**: Render.com uses PostgreSQL as their managed database service. You have two options:

**Option 1: Use PostgreSQL (Recommended for Render)**
1. Click "New +" → "PostgreSQL"
2. Name: `jmonline-database`
3. Plan: Starter (or higher)
4. Database Name: `jmonline`
5. User: `jmonline_user`
6. **Note**: You'll need to adapt your MySQL schema to PostgreSQL (see `database/README.md`)

**Option 2: Use External MySQL Service**
- Use services like PlanetScale, Aiven, or DigitalOcean Managed Databases
- Configure connection details in your API service environment variables

#### B. Create Backend API Service

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `jmonline-api`
   - **Environment**: `PHP`
   - **Build Command**: 
     ```bash
     mkdir -p uploads && chmod 755 uploads
     ```
   - **Start Command**: 
     ```bash
     php setup_users.php && apache2-foreground
     ```
   - **Root Directory**: `backend`
   - **Plan**: Starter (or higher)

4. **Environment Variables**:
   - `DB_HOST`: Your database host (from database service)
   - `DB_NAME`: `jmonline`
   - `DB_USER`: `jmonline_user`
   - `DB_PASS`: Your database password (from database service)
   - `PHP_VERSION`: `8.2`

5. **Advanced Settings**:
   - Health Check Path: `/api/index.php`

#### C. Create Frontend Static Site

1. Click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `jmonline-frontend`
   - **Build Command**: 
     ```bash
     cd frontend && npm install && npm run build
     ```
   - **Publish Directory**: `frontend/build`
   - **Root Directory**: `frontend` (optional)

4. **Environment Variables**:
   - `REACT_APP_API_URL`: Your backend API URL (e.g., `https://jmonline-api.onrender.com/api`)

### 3. Database Initialization

After the database is created, you need to run the initialization script:

1. Go to your database service on Render
2. Use the "Connect" tab to get connection details
3. You can either:
   - Use Render's database shell to run `database/init.sql`
   - Or create a one-time script/service to initialize

**Option A: Manual SQL Execution**
- Connect to your database using the provided connection string
- Run the contents of `database/init.sql`

**Option B: Auto-initialization Script**
- Create a temporary service that runs migrations on startup
- Or add migration logic to the backend startup command

### 4. Environment Variables Summary

#### Backend API Service:
```
DB_HOST=<your-database-host>
DB_NAME=jmonline
DB_USER=jmonline_user
DB_PASS=<your-database-password>
PHP_VERSION=8.2
```

#### Frontend Static Site:
```
REACT_APP_API_URL=https://jmonline-api.onrender.com/api
```

### 5. Custom Domain (Optional)

1. Go to your service settings
2. Add your custom domain
3. Render will provide DNS instructions

### 6. Enable Auto-Deploy

- Auto-deploy is enabled by default
- Every push to `main` branch will trigger a new deployment
- You can disable this in service settings

## Post-Deployment Tasks

1. **Run Database Migrations**:
   - Execute `database/init.sql` on your database
   - Run any additional migration files if needed

2. **Create Admin User**:
   - The `setup_users.php` script should run on backend startup
   - Or manually create an admin user in the database

3. **Configure CORS** (if needed):
   - Update Apache configuration to allow requests from frontend domain

4. **Set Up SSL**:
   - Render provides free SSL certificates automatically
   - Your services will be available at `https://your-service.onrender.com`

## Troubleshooting

### Backend Issues

- **500 Errors**: Check logs in Render dashboard
- **Database Connection**: Verify environment variables are correct
- **File Uploads**: Ensure `uploads` directory has write permissions

### Frontend Issues

- **API Connection**: Verify `REACT_APP_API_URL` points to correct backend URL
- **Build Failures**: Check Node.js version compatibility
- **CORS Errors**: May need to configure CORS in backend

### Database Issues

- **Connection Timeout**: Check IP allowlist in database settings
- **Migration Errors**: Verify SQL syntax is compatible with MySQL version

## Monitoring

- View logs in the Render dashboard
- Set up alerts for service failures
- Monitor database usage and scale if needed

## Scaling

- Upgrade service plans as needed
- Use Render's auto-scaling features
- Consider database read replicas for high traffic

## Support

- Render Documentation: https://render.com/docs
- Community: https://community.render.com

