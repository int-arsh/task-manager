const express = require('express');
const router = express.Router();
const {
  getUsers,
  createUser,
  deleteUser
} = require('../controllers/userController');
const auth = require('../middleware/auth');
const { isAdmin } = require('../middleware/authorize');
const {
  validateUserCreate,
  sanitizeInput
} = require('../middleware/validate');

// All routes require authentication and admin privileges
router.use(auth);
router.use(isAdmin);

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private/Admin
 */
router.get('/', getUsers);

/**
 * @route   POST /api/users
 * @desc    Create new user
 * @access  Private/Admin
 */
router.post('/', sanitizeInput, validateUserCreate, createUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Private/Admin
 */
router.delete('/:id', deleteUser);

module.exports = router;

