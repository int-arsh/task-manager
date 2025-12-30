require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');
const connectDB = require('./db');

/**
 * Seed script to create admin user and sample data
 */
const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    // Check if admin user already exists
    const adminExists = await User.findOne({ email: 'admin@taskmanager.com' });

    if (adminExists) {
      console.log('Admin user already exists. Skipping seed.');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      username: 'admin',
      email: 'admin@taskmanager.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('Admin user created successfully:');
    console.log(`  Username: ${admin.username}`);
    console.log(`  Email: ${admin.email}`);
    console.log(`  Password: admin123`);
    console.log(`  Role: ${admin.role}`);

    // Create a regular user for testing
    const testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'test123',
      role: 'user'
    });

    console.log('\nTest user created successfully:');
    console.log(`  Username: ${testUser.username}`);
    console.log(`  Email: ${testUser.email}`);
    console.log(`  Password: test123`);

    // Create sample tasks
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const tasks = await Task.create([
      {
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the task management system',
        dueDate: tomorrow,
        priority: 'high',
        assignedTo: testUser._id,
        createdBy: admin._id,
        status: 'pending'
      },
      {
        title: 'Review code changes',
        description: 'Review and approve pull requests from the development team',
        dueDate: nextWeek,
        priority: 'medium',
        assignedTo: admin._id,
        createdBy: admin._id,
        status: 'pending'
      },
      {
        title: 'Setup CI/CD pipeline',
        description: 'Configure continuous integration and deployment pipeline',
        dueDate: nextWeek,
        priority: 'urgent',
        assignedTo: testUser._id,
        createdBy: admin._id,
        status: 'completed'
      }
    ]);

    console.log(`\n${tasks.length} sample tasks created successfully.`);

    console.log('\nSeed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;

