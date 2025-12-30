// Vercel serverless function wrapper for Express app
// This file is used when deploying to Vercel as a serverless function

// Import and initialize the Express app
const app = require('../server');

// Export as serverless function
// Vercel will handle the request/response
module.exports = app;

