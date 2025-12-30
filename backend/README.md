# Task Management System - Backend

A complete MERN stack backend for a Task Management System with JWT authentication, role-based access control, and comprehensive API endpoints.

## Features

- 🔐 JWT-based authentication
- 👥 User management with roles (user/admin)
- 📝 Task CRUD operations
- 🔍 Task filtering, search, and pagination
- 🛡️ Security features (helmet, rate limiting, input sanitization)
- ✅ Input validation with express-validator
- 🎯 Role-based authorization
- 📊 Error handling middleware

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (jsonwebtoken)
- bcryptjs for password hashing
- express-validator for validation
- helmet for security headers
- express-rate-limit for rate limiting
- morgan for request logging

## Project Structure

```
backend/
├── config/
│   ├── db.js          # MongoDB connection
│   └── seed.js        # Database seeding script
├── controllers/
│   ├── authController.js
│   ├── taskController.js
│   └── userController.js
├── middleware/
│   ├── auth.js        # JWT authentication
│   ├── authorize.js   # Authorization checks
│   ├── validate.js    # Input validation
│   └── errorHandler.js # Error handling
├── models/
│   ├── User.js
│   └── Task.js
├── routes/
│   ├── auth.js
│   ├── tasks.js
│   └── users.js
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the backend directory:
```env
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

3. Make sure MongoDB is running on your system.

4. Seed the database (optional):
```bash
npm run seed
```

This will create:
- Admin user: `admin@taskmanager.com` / `admin123`
- Test user: `test@example.com` / `test123`
- Sample tasks

## Running the Server

Development mode (with nodemon):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000` (or the PORT specified in .env).

## API Endpoints

### Authentication (`/api/auth`)

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Tasks (`/api/tasks`)

All task routes require authentication.

- `GET /api/tasks` - Get all tasks (with pagination, filtering, search)
  - Query params: `page`, `limit`, `status`, `priority`, `search`, `all` (admin only)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/status` - Update task status
- `PATCH /api/tasks/:id/priority` - Update task priority

### Users (`/api/users`)

All user routes require admin authentication.

- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `DELETE /api/users/:id` - Delete user

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## Authentication

Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Security Features

- Password hashing with bcryptjs (10 salt rounds)
- JWT token expiration (7 days)
- Rate limiting on auth routes (5 requests per 15 minutes)
- Input sanitization to prevent XSS attacks
- Helmet for security headers
- CORS configuration
- Request validation with express-validator

## Error Handling

The application includes centralized error handling for:
- Validation errors
- Duplicate key errors
- Cast errors (invalid ObjectId)
- JWT errors
- Server errors

## License

ISC

