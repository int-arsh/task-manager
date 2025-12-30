# Quick Start Guide

## Prerequisites

1. Backend server running on `http://localhost:5000`
2. MongoDB running and connected
3. Node.js and npm installed

## Setup Steps

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Access the application:**
   - Open `http://localhost:3000` in your browser

## Default Admin Credentials

After running the backend seed script or on first run:
- Email: `admin@taskmanager.com`
- Password: `admin123`

## User Flow

1. **Register/Login:**
   - New users can register at `/register`
   - Existing users can login at `/login`
   - After login, users are redirected to `/dashboard`

2. **Dashboard:**
   - View task statistics
   - Switch between Board View and List View
   - Create new tasks

3. **Task Management:**
   - Create tasks with title, description, due date, priority
   - View tasks in priority columns (Board View)
   - Filter and search tasks (List View)
   - Edit/Delete tasks (if owner or admin)
   - Toggle task status (pending/completed)

4. **Admin Panel:**
   - Manage users (create, delete)
   - View all tasks across all users
   - Accessible only to admin users

## Features

- ✅ User authentication with JWT
- ✅ Task CRUD operations
- ✅ Priority-based Kanban board
- ✅ Task filtering and search
- ✅ Pagination
- ✅ Responsive design
- ✅ Admin panel
- ✅ Toast notifications
- ✅ Loading states
- ✅ Error handling

## Troubleshooting

**CORS Errors:**
- Make sure backend CORS is configured to allow `http://localhost:3000`

**API Connection Errors:**
- Verify backend is running on port 5000
- Check API base URL in `src/utils/api.js`

**Authentication Issues:**
- Clear localStorage and try logging in again
- Check if token is being stored correctly

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

