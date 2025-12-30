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
// Support multiple origins for Vercel (production, preview, localhost)
const getAllowedOrigins = () => {
  const origins = ['http://localhost:3000']; // Always allow localhost for development
  
  if (process.env.FRONTEND_URL) {
    // Split by comma to support multiple URLs
    const urls = process.env.FRONTEND_URL.split(',').map(url => {
      // Clean up URL: remove trailing slashes and any paths
      let cleanUrl = url.trim();
      // Remove trailing slash
      cleanUrl = cleanUrl.replace(/\/+$/, '');
      // Extract just the origin (protocol + host)
      try {
        const urlObj = new URL(cleanUrl);
        return `${urlObj.protocol}//${urlObj.host}`;
      } catch (e) {
        // If URL parsing fails, try to extract origin manually
        const match = cleanUrl.match(/^(https?:\/\/[^\/]+)/);
        return match ? match[1] : cleanUrl;
      }
    });
    origins.push(...urls);
  }
  
  return origins;
};

const allowedOrigins = getAllowedOrigins();

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
    if (!origin) {
      return callback(null, true);
    }
    
    // Extract base origin (protocol + host only, no path)
    let baseOrigin;
    try {
      const urlObj = new URL(origin);
      baseOrigin = `${urlObj.protocol}//${urlObj.host}`;
    } catch (e) {
      // Fallback: extract origin manually
      const match = origin.match(/^(https?:\/\/[^\/]+)/);
      baseOrigin = match ? match[1] : origin;
    }
    
    // Check if origin matches any allowed origin
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      // Normalize both URLs for comparison (remove trailing slashes)
      const normalizedAllowed = allowedOrigin.replace(/\/+$/, '').toLowerCase();
      const normalizedOrigin = baseOrigin.replace(/\/+$/, '').toLowerCase();
      
      // Exact match
      if (normalizedOrigin === normalizedAllowed) {
        return true;
      }
      
      // For Vercel: allow any vercel.app domain if any vercel.app domain is allowed
      // This handles preview deployments which have different subdomains
      if (normalizedAllowed.includes('.vercel.app') && normalizedOrigin.includes('.vercel.app')) {
        // Extract project identifier (first part before first dot)
        const allowedMatch = normalizedAllowed.match(/https?:\/\/([^.]+)/);
        const originMatch = normalizedOrigin.match(/https?:\/\/([^.]+)/);
        
        if (allowedMatch && originMatch) {
          // For Vercel, project names can have different suffixes for previews
          // So we check if they share a common prefix
          const allowedParts = allowedMatch[1].split('-');
          const originParts = originMatch[1].split('-');
          
          // If they share the first 2-3 parts, likely same project
          const minLength = Math.min(allowedParts.length, originParts.length, 3);
          const allowedPrefix = allowedParts.slice(0, minLength).join('-');
          const originPrefix = originParts.slice(0, minLength).join('-');
          
          return allowedPrefix === originPrefix;
        }
      }
      
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      // In development, allow all origins for easier testing
      if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
        callback(null, true);
      } else {
        // Log for debugging
        console.log('CORS blocked origin:', baseOrigin);
        console.log('Allowed origins:', allowedOrigins);
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
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

