const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateStatus,
  updatePriority,
  getTaskStats
} = require('../controllers/taskController');
const auth = require('../middleware/auth');
const { isTaskOwnerOrAdmin } = require('../middleware/authorize');
const {
  validateTaskCreate,
  validateTaskUpdate,
  validateTaskStatus,
  validateTaskPriority,
  validateTaskQuery,
  sanitizeInput
} = require('../middleware/validate');

// All routes require authentication
router.use(auth);

// Apply query validation to GET / route
router.get('/', validateTaskQuery, getTasks);

/**
 * @route   GET /api/tasks/stats
 * @desc    Get task statistics
 * @access  Private
 */
router.get('/stats', getTaskStats);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get single task by ID
 * @access  Private
 */
router.get('/:id', getTask);

/**
 * @route   POST /api/tasks
 * @desc    Create new task
 * @access  Private
 */
router.post('/', sanitizeInput, validateTaskCreate, createTask);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update task
 * @access  Private
 */
router.put('/:id', isTaskOwnerOrAdmin, sanitizeInput, validateTaskUpdate, updateTask);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete task
 * @access  Private
 */
router.delete('/:id', isTaskOwnerOrAdmin, deleteTask);

/**
 * @route   PATCH /api/tasks/:id/status
 * @desc    Update task status
 * @access  Private
 */
router.patch('/:id/status', isTaskOwnerOrAdmin, sanitizeInput, validateTaskStatus, updateStatus);

/**
 * @route   PATCH /api/tasks/:id/priority
 * @desc    Update task priority
 * @access  Private
 */
router.patch('/:id/priority', isTaskOwnerOrAdmin, sanitizeInput, validateTaskPriority, updatePriority);

module.exports = router;

