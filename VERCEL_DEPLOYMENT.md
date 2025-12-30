# Vercel Deployment Guide

This guide will help you deploy the frontend of the Task Management System to Vercel.

## Prerequisites

1. A GitHub account with the repository pushed
2. A Vercel account (free tier works)
3. Backend deployed and accessible (or running locally for testing)

## Step-by-Step Deployment

### 1. Prepare Your Repository

Make sure your `frontend` folder is in the root of your repository and contains:
- `package.json`
- `src/` directory
- `public/` directory (if exists)
- `vercel.json` (already created)

### 2. Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository
5. Click **"Import"**

### 3. Configure Project Settings

#### Root Directory
- **Root Directory**: Set to `frontend`
  - Click "Edit" next to Root Directory
  - Select `frontend` folder
  - Click "Continue"

#### Build Settings
Vercel should auto-detect Create React App, but verify:
- **Framework Preset**: Create React App
- **Build Command**: `npm run build` (should be auto-detected)
- **Output Directory**: `build` (should be auto-detected)
- **Install Command**: `npm install` (should be auto-detected)

### 4. Set Environment Variables

Click on **"Environment Variables"** and add:

```
REACT_APP_API_URL=https://your-backend-url.com/api
```

**Important Notes:**
- Replace `https://your-backend-url.com/api` with your actual backend URL
- If backend is on Heroku/Railway/Render, use that URL
- If backend is on a custom domain, use that
- The URL should NOT have a trailing slash

**Example:**
```
REACT_APP_API_URL=https://task-manager-api.herokuapp.com/api
```

or

```
REACT_APP_API_URL=https://api.yourdomain.com/api
```

### 5. Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 2-3 minutes)
3. Once deployed, you'll get a URL like: `https://your-project.vercel.app`

### 6. Update Backend CORS (If Needed)

Make sure your backend allows requests from your Vercel domain:

In `backend/server.js`, update CORS:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-project.vercel.app'  // Add your Vercel URL
  ],
  credentials: true
}));
```

Or for production, you can use:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

And set `FRONTEND_URL` in your backend `.env` to your Vercel URL.

## Environment Variables Reference

### Required for Production
- `REACT_APP_API_URL` - Your backend API URL (e.g., `https://api.example.com/api`)

### Optional
- None currently

## Troubleshooting

### Build Fails

1. **Check Build Logs**: Click on the failed deployment to see error logs
2. **Common Issues**:
   - Missing dependencies: Check `package.json`
   - Build errors: Check for TypeScript/ESLint errors
   - Tailwind CSS issues: Ensure `tailwind.config.js` is correct

### API Calls Fail (CORS Errors)

1. **Check Backend CORS**: Ensure your backend allows your Vercel domain
2. **Check API URL**: Verify `REACT_APP_API_URL` is set correctly
3. **Check Network Tab**: Open browser DevTools → Network tab to see actual requests

### 404 Errors on Refresh

The `vercel.json` file includes rewrites to handle React Router. If you still get 404s:
- Ensure `vercel.json` is in the `frontend` folder
- Check that rewrites are configured correctly

### Environment Variables Not Working

- Environment variables must start with `REACT_APP_` to be accessible in React
- After adding/changing env vars, redeploy the project
- Check that variables are set for the correct environment (Production, Preview, Development)

## Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Click **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions

## Continuous Deployment

Vercel automatically deploys on every push to your main branch:
- **Production**: Deploys from `main` or `master` branch
- **Preview**: Deploys from other branches and pull requests

## Post-Deployment Checklist

- [ ] Test login functionality
- [ ] Test task creation
- [ ] Test task editing/deletion
- [ ] Test admin panel (if admin user)
- [ ] Verify API calls are working
- [ ] Check mobile responsiveness
- [ ] Test on different browsers

## Quick Reference

**Vercel Dashboard**: https://vercel.com/dashboard
**Documentation**: https://vercel.com/docs

## Support

If you encounter issues:
1. Check Vercel build logs
2. Check browser console for errors
3. Verify environment variables are set
4. Ensure backend is accessible and CORS is configured

