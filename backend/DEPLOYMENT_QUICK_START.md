# Quick Start: Deploy Backend to Vercel

## Prerequisites
- MongoDB Atlas account (free tier works)
- GitHub repository with backend code

## Steps

### 1. Get MongoDB Connection String
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster → Get connection string
3. Format: `mongodb+srv://username:password@cluster.mongodb.net/taskmanager`

### 2. Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repo
4. **Set Root Directory to: `backend`**

### 3. Configure Build
- Framework: **Other**
- Build Command: (leave empty)
- Output Directory: (leave empty)
- Install Command: `npm install`

### 4. Add Environment Variables

In Vercel → Your Project → Settings → Environment Variables:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority
```

```
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
```

```
FRONTEND_URL=https://your-frontend.vercel.app
```

⚠️ **Important**: Use only the base URL (no paths like `/login`). Example: `https://task-manager-khaki-eight-17.vercel.app`

### 5. Deploy
Click "Deploy" and wait for completion.

### 6. Update Frontend
In your frontend Vercel project, update environment variable:

```
REACT_APP_API_URL=https://your-backend.vercel.app/api
```

## Your API will be at:
- `https://your-backend.vercel.app/api/*`
- Health: `https://your-backend.vercel.app/health`

## Important Notes
⚠️ Vercel free tier has 10-second function timeout  
⚠️ Use MongoDB Atlas (not local MongoDB)  
⚠️ Set Root Directory to `backend` folder

