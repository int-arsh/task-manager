# Task Management System - MERN Stack

A complete, production-ready Task Management System built with the MERN stack (MongoDB, Express, React, Node.js). Features user authentication, role-based access control, task management with priority-based Kanban board, and comprehensive admin panel.

![Task Management System](https://img.shields.io/badge/Stack-MERN-blue)
![License](https://img.shields.io/badge/License-ISC-green)

## 🚀 Features

### Core Features
- ✅ **User Authentication** - JWT-based authentication with secure password hashing
- ✅ **Role-Based Access Control** - Admin and Normal user roles with different permissions
- ✅ **Task Management** - Full CRUD operations for tasks
- ✅ **Priority Board** - Kanban-style board view with 4 priority columns
- ✅ **Task Filtering** - Filter by status, priority, and search functionality
- ✅ **Pagination** - Efficient pagination for large task lists
- ✅ **Admin Panel** - Complete user and task management for admins
- ✅ **Responsive Design** - Mobile-friendly, modern UI with Tailwind CSS
- ✅ **Real-time Updates** - Optimistic UI updates with proper error handling

### Security Features
- 🔐 JWT token authentication (7-day expiration)
- 🔒 Password hashing with bcryptjs (10 salt rounds)
- 🛡️ Rate limiting on auth routes (5 requests per 15 minutes)
- 🧹 Input sanitization to prevent XSS attacks
- 🔒 Helmet.js for security headers
- ✅ CORS configuration
- ✅ Request validation with express-validator

## 📁 Project Structure

```
task-manager/
├── backend/                 # Node.js/Express Backend
│   ├── config/            # Database and seed configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth, validation, error handling
│   ├── models/            # Mongoose models (User, Task)
│   ├── routes/           # API routes
│   ├── server.js         # Express server entry point
│   └── package.json
│
├── frontend/              # React Frontend
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React Context (AuthContext)
│   │   ├── utils/        # API client and helpers
│   │   ├── App.js        # Main app component
│   │   └── index.js      # Entry point
│   └── package.json
│
└── README.md             # This file
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **morgan** - Request logging

### Frontend
- **React 19** - UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **date-fns** - Date formatting
- **Context API** - State management

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task-manager
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

## 🚀 Running the Application

### Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On Linux/Mac
sudo systemctl start mongod
# or
mongod

# On Windows
net start MongoDB
```

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will start on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm start
```

The frontend will open at `http://localhost:3000`

## 👤 Default Admin Credentials

On first run, an admin user is automatically created:

- **Email**: `admin@taskmanager.com`
- **Password**: `admin123`
- **Role**: `admin`

> ⚠️ **Important**: Change the admin password in production!

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Task Endpoints

All task endpoints require authentication (JWT token in Authorization header).

#### Get All Tasks
```http
GET /api/tasks?page=1&limit=10&status=pending&priority=high&search=keyword
Authorization: Bearer <token>
```

#### Get Single Task
```http
GET /api/tasks/:id
Authorization: Bearer <token>
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the task management system",
  "dueDate": "2024-12-31T23:59:59.000Z",
  "priority": "high",
  "assignedTo": "user_id"
}
```

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "priority": "urgent"
}
```

#### Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

#### Update Task Status
```http
PATCH /api/tasks/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed"
}
```

#### Update Task Priority
```http
PATCH /api/tasks/:id/priority
Authorization: Bearer <token>
Content-Type: application/json

{
  "priority": "high"
}
```

### User Management Endpoints (Admin Only)

#### Get All Users
```http
GET /api/users
Authorization: Bearer <admin_token>
```

#### Create User
```http
POST /api/users
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123",
  "role": "user"
}
```

#### Delete User
```http
DELETE /api/users/:id
Authorization: Bearer <admin_token>
```

## 🎯 User Roles & Permissions

### Normal User
- ✅ Create, view, edit, and delete their own tasks
- ✅ View tasks assigned to them only
- ✅ Update task status and priority
- ✅ View personal dashboard and statistics
- ❌ Cannot access admin panel
- ❌ Cannot manage other users
- ❌ Cannot assign tasks to other users

### Admin User
- ✅ All normal user permissions
- ✅ View all tasks in the system (with `?all=true`)
- ✅ Create tasks for any user
- ✅ Edit/delete any task
- ✅ Reassign tasks to any user
- ✅ Manage users (create, view, delete)
- ✅ Access admin panel

## 🎨 Frontend Routes

- `/` - Redirects to dashboard or login
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Main dashboard (protected)
- `/tasks` - Task list view (protected)
- `/tasks/create` - Create new task (protected)
- `/tasks/:id` - Task details (protected)
- `/tasks/:id/edit` - Edit task (protected)
- `/admin` - Admin panel (protected, admin only)

## 🔒 Security Features

### Backend
- JWT token authentication
- Password hashing with bcryptjs
- Input validation and sanitization
- Rate limiting on auth routes
- Helmet.js for security headers
- CORS configuration
- Error handling middleware

### Frontend
- Protected routes with authentication check
- Token storage in localStorage
- Auto-logout on 401 errors
- Input validation
- XSS protection

## 📊 Database Models

### User Model
```javascript
{
  username: String (required, unique),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date
}
```

### Task Model
```javascript
{
  title: String (required, max 100 chars),
  description: String (required),
  dueDate: Date (required),
  status: String (enum: ['pending', 'completed'], default: 'pending'),
  priority: String (enum: ['low', 'medium', 'high', 'urgent'], default: 'medium'),
  assignedTo: ObjectId (ref: User, required),
  createdBy: ObjectId (ref: User, required),
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

### Seed Database

Create sample data:

```bash
cd backend
npm run seed
```

This creates:
- Admin user: `admin@taskmanager.com` / `admin123`
- Test user: `test@example.com` / `test123`
- Sample tasks

## 📦 Building for Production

### Backend

```bash
cd backend
npm start
```

### Frontend

```bash
cd frontend
npm run build
```

The production build will be in the `frontend/build` directory.

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` or `sudo systemctl start mongod`
- Check `MONGO_URI` in `.env` file
- Verify MongoDB is accessible on the specified port

### CORS Errors
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check that backend CORS is configured correctly

### Authentication Issues
- Clear localStorage and try logging in again
- Verify JWT_SECRET is set in backend `.env`
- Check token expiration (default: 7 days)

### Port Already in Use
- Change `PORT` in backend `.env` file
- Or kill the process using the port: `lsof -ti:5000 | xargs kill`

## 📝 Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env) - Optional
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Task Management System - MERN Stack Application

## 🙏 Acknowledgments

- Built with modern web technologies
- Follows RESTful API principles
- Implements security best practices
- Responsive and accessible design

---

## 📞 Support

For issues, questions, or contributions, please open an issue on the repository.

**Happy Task Managing! 🎉**

