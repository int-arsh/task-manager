# Task Management System - Frontend

A complete React frontend for the Task Management System with Tailwind CSS styling.

## Features

- 🔐 User authentication (Login/Register)
- 📝 Task CRUD operations
- 🎯 Priority-based task board (Kanban-style)
- 📊 Task statistics dashboard
- 🔍 Task filtering and search
- 👥 Admin panel for user management
- 📱 Responsive design
- ⚡ Optimized performance with lazy loading

## Tech Stack

- React 19
- React Router DOM v7
- Axios for API calls
- Tailwind CSS for styling
- date-fns for date formatting
- Context API for state management

## Installation

1. Install dependencies:
```bash
npm install
```

2. Make sure the backend server is running on `http://localhost:5000`

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.jsx
│   ├── TaskForm.jsx
│   ├── TaskCard.jsx
│   ├── TaskList.jsx
│   ├── PriorityBoard.jsx
│   ├── PriorityColumn.jsx
│   ├── ConfirmDialog.jsx
│   ├── Pagination.jsx
│   └── PrivateRoute.jsx
├── pages/              # Page components
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── Tasks.jsx
│   ├── TaskDetails.jsx
│   ├── CreateTask.jsx
│   ├── EditTask.jsx
│   └── AdminPanel.jsx
├── context/            # Context providers
│   └── AuthContext.jsx
├── utils/              # Utility functions
│   ├── api.js          # Axios instance and API methods
│   └── helpers.js      # Helper functions
├── App.js              # Main app component with routing
└── index.js            # Entry point
```

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests

## Features Overview

### Authentication
- User registration with validation
- Login with JWT token storage
- Auto-logout on token expiration
- Protected routes

### Dashboard
- Task statistics (Total, Pending, Completed)
- Priority board view (Kanban-style)
- List view with pagination
- Quick task creation

### Task Management
- Create tasks with title, description, due date, priority
- Edit tasks (if owner or admin)
- Delete tasks with confirmation
- Toggle task status (pending/completed)
- View task details

### Admin Panel
- User management (view, create, delete users)
- View all tasks across all users
- Manage user roles

### Styling
- Tailwind CSS for all styling
- Responsive design (mobile-friendly)
- Consistent color scheme
- Loading states and animations
- Toast notifications

## Color Scheme

- Primary: Blue (#3B82F6)
- Success: Green (#10B981)
- Warning: Yellow (#F59E0B)
- Danger: Red (#EF4444)
- Priority Colors:
  - Low: Green (#10B981)
  - Medium: Yellow (#F59E0B)
  - High: Orange (#F97316)
  - Urgent: Red (#EF4444)

## API Integration

The frontend communicates with the backend API at `http://localhost:5000/api`. All API calls are handled through the `utils/api.js` file with automatic token injection and error handling.

## Environment Variables

Create a `.env` file if you need to change the API base URL:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Performance Optimizations

- Lazy loading of routes
- React.memo for expensive components
- Debounced search (can be added)
- Optimistic UI updates

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

ISC

