# Vercel Deployment Checklist

## Quick Steps

### 1. Import to Vercel
- Go to https://vercel.com/dashboard
- Click "Add New..." → "Project"
- Import your GitHub repository
- **Set Root Directory to: `frontend`**

### 2. Configure Build Settings
Vercel should auto-detect, but verify:
- Framework: Create React App
- Build Command: `npm run build`
- Output Directory: `build`
- Install Command: `npm install`

### 3. Set Environment Variable
Add this environment variable in Vercel:

**Name:** `REACT_APP_API_URL`  
**Value:** `https://your-backend-url.vercel.app`

**Note:** You can include `/api` or not - the code will automatically append it if missing.
Examples:
- `https://task-manager-hcfr.vercel.app` ✅ (will become `/api`)
- `https://task-manager-hcfr.vercel.app/api` ✅ (already has `/api`)

Replace `your-backend-url.vercel.app` with your actual backend Vercel URL.

### 4. Deploy
- Click "Deploy"
- Wait for build to complete
- Your app will be live at `https://your-project.vercel.app`

### 5. Update Backend CORS
In your backend `.env`, add your Vercel URL:

```env
FRONTEND_URL=https://your-project.vercel.app
```

Or update `backend/server.js` CORS to include your Vercel domain.

## Important Notes

✅ **Root Directory**: Must be set to `frontend` folder  
✅ **Environment Variable**: Must start with `REACT_APP_`  
✅ **Backend CORS**: Must allow your Vercel domain  
✅ **API URL**: Should be your production backend URL (not localhost)

## Files Changed for Deployment

1. ✅ `frontend/src/utils/api.js` - Now uses `REACT_APP_API_URL` environment variable
2. ✅ `frontend/vercel.json` - Vercel configuration file created
3. ✅ `.gitignore` - Updated to ignore Vercel files

## Testing After Deployment

1. Visit your Vercel URL
2. Try logging in
3. Create a task
4. Check if API calls work (open browser DevTools → Network tab)

If you see CORS errors, update your backend CORS configuration.

