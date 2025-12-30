# Backend Deployment on Vercel

This guide will help you deploy the backend of the Task Management System to Vercel as a serverless function.

## Prerequisites

1. A GitHub account with the repository pushed
2. A Vercel account (free tier works)
3. MongoDB Atlas account (recommended) or MongoDB connection string

## Important Notes

⚠️ **Vercel Serverless Limitations:**
- Functions have a 10-second timeout on free tier (60s on Pro)
- Cold starts can add latency
- MongoDB connections need to be handled carefully (connection pooling)
- Consider using MongoDB Atlas for production

## Step-by-Step Deployment

### 1. Prepare MongoDB

**Option A: MongoDB Atlas (Recommended)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Format: `mongodb+srv://username:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority`

**Option B: Use existing MongoDB**
- Use your existing MongoDB connection string

### 2. Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository
5. Click **"Import"**

### 3. Configure Project Settings

#### Root Directory
- **Root Directory**: Set to `backend`
  - Click "Edit" next to Root Directory
  - Select `backend` folder
  - Click "Continue"

#### Build Settings
- **Framework Preset**: Other
- **Build Command**: Leave empty (or `npm install`)
- **Output Directory**: Leave empty
- **Install Command**: `npm install`

### 4. Set Environment Variables

Click on **"Environment Variables"** and add:

#### Required Variables:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority
```

```
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars
```

```
FRONTEND_URL=https://your-frontend-vercel-url.vercel.app
```

**Important**: 
- Do NOT include any path (like `/login` or `/dashboard`)
- Use only the base URL: `https://your-frontend.vercel.app`
- You can add multiple URLs separated by commas: `https://frontend1.vercel.app,https://frontend2.vercel.app`

#### Optional Variables:

```
NODE_ENV=production
```

```
PORT=5000
```

**Important:**
- Replace MongoDB connection string with your actual Atlas connection string
- Use a strong, random JWT_SECRET (at least 32 characters)
- Replace FRONTEND_URL with your frontend Vercel URL

### 5. Deploy

1. Click **"Deploy"**
2. Wait for the build to complete
3. Once deployed, you'll get a URL like: `https://your-backend.vercel.app`

### 6. Update Frontend API URL

Update your frontend environment variable in Vercel:

```
REACT_APP_API_URL=https://your-backend.vercel.app/api
```

## API Endpoints After Deployment

Your API will be available at:
- Base URL: `https://your-backend.vercel.app`
- Health Check: `https://your-backend.vercel.app/health`
- Auth: `https://your-backend.vercel.app/api/auth/*`
- Tasks: `https://your-backend.vercel.app/api/tasks/*`
- Users: `https://your-backend.vercel.app/api/users/*`

## MongoDB Connection Optimization

For serverless functions, MongoDB connections should be reused. The current setup handles this, but for better performance:

1. **Use MongoDB Atlas** (recommended)
2. **Connection Pooling**: Already handled by Mongoose
3. **Keep connections alive**: Mongoose handles this automatically

## Troubleshooting

### Build Fails

1. **Check Build Logs**: Click on the failed deployment
2. **Common Issues**:
   - Missing dependencies: Check `package.json`
   - MongoDB connection errors: Verify `MONGO_URI` is correct
   - Environment variables not set

### Function Timeout

- Free tier: 10 seconds max
- Pro tier: 60 seconds max
- If operations take longer, consider:
  - Optimizing database queries
  - Using background jobs for heavy operations
  - Upgrading to Pro plan

### MongoDB Connection Issues

- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0) or add Vercel IPs
- Check connection string format
- Verify username/password are correct

### CORS Errors

- Ensure `FRONTEND_URL` is set correctly
- Check that your frontend URL matches exactly (including https://)

## Alternative: Deploy Backend Separately

If you encounter issues with Vercel serverless, consider:

1. **Railway** - Easy Node.js deployment
2. **Render** - Free tier available
3. **Heroku** - Traditional PaaS
4. **DigitalOcean App Platform** - Simple deployment

## Post-Deployment Checklist

- [ ] Test health endpoint: `https://your-backend.vercel.app/health`
- [ ] Test registration endpoint
- [ ] Test login endpoint
- [ ] Verify MongoDB connection
- [ ] Check function logs in Vercel dashboard
- [ ] Update frontend API URL
- [ ] Test full flow (register → login → create task)

## Quick Reference

**Vercel Dashboard**: https://vercel.com/dashboard  
**MongoDB Atlas**: https://www.mongodb.com/cloud/atlas  
**Function Logs**: Vercel Dashboard → Your Project → Functions → View Logs

## Environment Variables Summary

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_secret_key_here` |
| `FRONTEND_URL` | Frontend Vercel URL | `https://your-frontend.vercel.app` |
| `NODE_ENV` | Environment | `production` |

---

**Note**: For production, consider using a dedicated backend hosting service (Railway, Render, Heroku) as they're better suited for long-running Express servers. Vercel serverless works but has timeout limitations.

