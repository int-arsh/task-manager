const mongoose = require('mongoose');

/**
 * Connect to MongoDB
 * Optimized for serverless environments (Vercel)
 */
const connectDB = async () => {
  try {
    // Check if already connected (for serverless function reuse)
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB already connected');
      return;
    }

    // Connection options optimized for serverless
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    };

    const conn = await mongoose.connect(process.env.MONGO_URI, options);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // In serverless, don't exit process, just log error
    if (process.env.VERCEL !== '1' && !process.env.VERCEL_ENV) {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = connectDB;

