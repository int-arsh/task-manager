const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const User = require('./models/User');

// Import routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Create admin user on first run if no users exist
// Optimized for both traditional server and serverless environments
const createAdminIfNeeded = async () => {
  try {
    // Wait for connection if not already connected
    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Connection timeout')), 10000);
        mongoose.connection.once('connected', () => {
          clearTimeout(timeout);
          resolve();
        });
        mongoose.connection.once('error', (err) => {
          clearTimeout(timeout);
          reject(err);
        });
      });
    }
    
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const admin = await User.create({
        username: 'admin',
        email: 'admin@taskmanager.com',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Admin user created on first run:');
      console.log(`  Username: ${admin.username}`);
      console.log(`  Email: ${admin.email}`);
      console.log(`  Password: admin123`);
    }
  } catch (error) {
    console.error('Error creating admin user:', error.message);
    // Don't throw in serverless - just log
  }
};

// Run admin creation when connected
mongoose.connection.once('connected', createAdminIfNeeded);

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (only in development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check route
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Server setup - only start server if not in serverless environment
// Vercel will handle the serverless function, so we don't need to listen on a port
if (process.env.VERCEL !== '1' && !process.env.VERCEL_ENV) {
  const PORT = process.env.PORT || 5000;
  
  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  // Graceful shutdown handling (only for non-serverless)
  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      mongoose.connection.close(false, () => {
        console.log('MongoDB connection closed');
        process.exit(0);
      });
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
      console.log('HTTP server closed');
      mongoose.connection.close(false, () => {
        console.log('MongoDB connection closed');
        process.exit(0);
      });
    });
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    server.close(() => {
      process.exit(1);
    });
  });
}

module.exports = app;

