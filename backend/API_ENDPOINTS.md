# API Endpoints Documentation

Base URL: `http://localhost:5000/api`

All endpoints return JSON responses in the following format:
- **Success**: `{ success: true, data: {...} }`
- **Error**: `{ success: false, error: "error message" }`

---

## Authentication Endpoints (`/api/auth`)

### 1. Register User
- **POST** `/api/auth/register`
- **Access**: Public
- **Rate Limit**: None
- **Request Body**:
  ```json
  {
    "username": "string (3-30 chars, alphanumeric + underscore)",
    "email": "string (valid email)",
    "password": "string (min 6 chars)"
  }
  ```
- **Response** (201):
  ```json
  {
    "success": true,
    "data": {
      "token": "JWT_TOKEN",
      "user": {
        "_id": "user_id",
        "username": "username",
        "email": "email@example.com",
        "role": "user",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    }
  }
  ```

### 2. Login User
- **POST** `/api/auth/login`
- **Access**: Public
- **Rate Limit**: 5 requests per 15 minutes per IP
- **Request Body**:
  ```json
  {
    "email": "string (valid email)",
    "password": "string"
  }
  ```
- **Response** (200):
  ```json
  {
    "success": true,
    "data": {
      "token": "JWT_TOKEN",
      "user": {
        "_id": "user_id",
        "username": "username",
        "email": "email@example.com",
        "role": "user",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    }
  }
  ```

### 3. Get Current User
- **GET** `/api/auth/me`
- **Access**: Private (requires JWT token)
- **Headers**: `Authorization: Bearer <token>`
- **Response** (200):
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "_id": "user_id",
        "username": "username",
        "email": "email@example.com",
        "role": "user",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    }
  }
  ```

---

## Task Endpoints (`/api/tasks`)

**All task endpoints require authentication** (JWT token in Authorization header)

### 1. Get All Tasks
- **GET** `/api/tasks`
- **Access**: Private
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10, max: 100)
  - `status` (optional): Filter by status (`pending` | `completed`)
  - `priority` (optional): Filter by priority (`low` | `medium` | `high` | `urgent`)
  - `search` (optional): Search in title and description
  - `all` (optional): If `true` and user is admin, returns all tasks (default: false)
- **Response** (200):
  ```json
  {
    "success": true,
    "data": {
      "tasks": [
        {
          "_id": "task_id",
          "title": "Task title",
          "description": "Task description",
          "dueDate": "2024-12-31T23:59:59.000Z",
          "status": "pending",
          "priority": "medium",
          "assignedTo": {
            "_id": "user_id",
            "username": "username",
            "email": "email@example.com"
          },
          "createdBy": {
            "_id": "user_id",
            "username": "username",
            "email": "email@example.com"
          },
          "createdAt": "2024-01-01T00:00:00.000Z",
          "updatedAt": "2024-01-01T00:00:00.000Z"
        }
      ],
      "pagination": {
        "currentPage": 1,
        "totalPages": 5,
        "totalTasks": 50,
        "limit": 10
      }
    }
  }
  ```

### 2. Get Single Task
- **GET** `/api/tasks/:id`
- **Access**: Private (must own task or be admin)
- **Response** (200):
  ```json
  {
    "success": true,
    "data": {
      "task": {
        "_id": "task_id",
        "title": "Task title",
        "description": "Task description",
        "dueDate": "2024-12-31T23:59:59.000Z",
        "status": "pending",
        "priority": "medium",
        "assignedTo": {...},
        "createdBy": {...},
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    }
  }
  ```

### 3. Create Task
- **POST** `/api/tasks`
- **Access**: Private
- **Request Body**:
  ```json
  {
    "title": "string (required, max 100 chars)",
    "description": "string (required)",
    "dueDate": "ISO8601 date string (required)",
    "priority": "low | medium | high | urgent (optional, default: medium)",
    "assignedTo": "user_id (required, but non-admins can only assign to themselves)"
  }
  ```
- **Response** (201):
  ```json
  {
    "success": true,
    "data": {
      "task": {...}
    }
  }
  ```

### 4. Update Task
- **PUT** `/api/tasks/:id`
- **Access**: Private (must own task or be admin)
- **Request Body** (all fields optional):
  ```json
  {
    "title": "string",
    "description": "string",
    "dueDate": "ISO8601 date string",
    "priority": "low | medium | high | urgent",
    "assignedTo": "user_id (admin only)"
  }
  ```
- **Response** (200):
  ```json
  {
    "success": true,
    "data": {
      "task": {...}
    }
  }
  ```

### 5. Delete Task
- **DELETE** `/api/tasks/:id`
- **Access**: Private (must own task or be admin)
- **Response** (200):
  ```json
  {
    "success": true,
    "data": {
      "message": "Task deleted successfully"
    }
  }
  ```

### 6. Update Task Status
- **PATCH** `/api/tasks/:id/status`
- **Access**: Private (must own task or be admin)
- **Request Body**:
  ```json
  {
    "status": "pending | completed"
  }
  ```
- **Response** (200):
  ```json
  {
    "success": true,
    "data": {
      "task": {...}
    }
  }
  ```

### 7. Update Task Priority
- **PATCH** `/api/tasks/:id/priority`
- **Access**: Private (must own task or be admin)
- **Request Body**:
  ```json
  {
    "priority": "low | medium | high | urgent"
  }
  ```
- **Response** (200):
  ```json
  {
    "success": true,
    "data": {
      "task": {...}
    }
  }
  ```

---

## User Management Endpoints (`/api/users`)

**All user endpoints require admin authentication**

### 1. Get All Users
- **GET** `/api/users`
- **Access**: Private/Admin
- **Response** (200):
  ```json
  {
    "success": true,
    "data": {
      "users": [
        {
          "_id": "user_id",
          "username": "username",
          "email": "email@example.com",
          "role": "user",
          "createdAt": "2024-01-01T00:00:00.000Z"
        }
      ]
    }
  }
  ```

### 2. Create User (Admin)
- **POST** `/api/users`
- **Access**: Private/Admin
- **Request Body**:
  ```json
  {
    "username": "string (3-30 chars)",
    "email": "string (valid email)",
    "password": "string (min 6 chars)",
    "role": "user | admin (optional, default: user)"
  }
  ```
- **Response** (201):
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "_id": "user_id",
        "username": "username",
        "email": "email@example.com",
        "role": "user",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    }
  }
  ```

### 3. Delete User
- **DELETE** `/api/users/:id`
- **Access**: Private/Admin
- **Note**: Cannot delete own account. Deletes all tasks created by the user.
- **Response** (200):
  ```json
  {
    "success": true,
    "data": {
      "message": "User and associated tasks deleted successfully"
    }
  }
  ```

---

## Health Check

### Server Health
- **GET** `/health`
- **Access**: Public
- **Response** (200):
  ```json
  {
    "success": true,
    "message": "Server is running",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
  ```

---

## Authentication

Include JWT token in the Authorization header for protected routes:
```
Authorization: Bearer <your_jwt_token>
```

Token expires in 7 days.

---

## Error Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (invalid/missing token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found
- **500**: Internal Server Error

---

## Example Usage

### Register and Login Flow:
```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"test123"}'

# 2. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# 3. Use token for protected routes
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer <your_token>"
```

### Create Task:
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project",
    "description": "Finish the task management system",
    "dueDate": "2024-12-31T23:59:59.000Z",
    "priority": "high",
    "assignedTo": "<user_id>"
  }'
```

### Get Tasks with Filters:
```bash
curl -X GET "http://localhost:5000/api/tasks?status=pending&priority=high&page=1&limit=10" \
  -H "Authorization: Bearer <your_token>"
```

