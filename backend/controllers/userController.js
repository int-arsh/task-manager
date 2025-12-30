const User = require('../models/User');
const Task = require('../models/Task');

/**
 * @route   GET /api/users
 * @desc    Get all users (admin only)
 * @access  Private/Admin
 */
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { users }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/users
 * @desc    Create new user (admin only)
 * @access  Private/Admin
 */
const createUser = async (req, res, next) => {
  try {
    const { username, email, password, role = 'user' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: existingUser.email === email 
          ? 'User with this email already exists'
          : 'Username is already taken'
      });
    }

    // Create new user (password will be hashed by pre-save hook)
    const user = await User.create({
      username,
      email,
      password,
      role
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user (admin only)
 * @access  Private/Admin
 */
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // Cannot delete self
    if (userId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        error: 'You cannot delete your own account'
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Delete all tasks created by this user
    await Task.deleteMany({ createdBy: userId });

    // Delete user
    await User.findByIdAndDelete(userId);

    res.json({
      success: true,
      data: { message: 'User and associated tasks deleted successfully' }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  createUser,
  deleteUser
};

