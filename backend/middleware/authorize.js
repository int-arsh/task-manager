const Task = require('../models/Task');

/**
 * Authorization Middleware
 * Checks if user has permission to perform the action
 */

/**
 * Check if user is admin
 */
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  
  return res.status(403).json({
    success: false,
    error: 'Access denied. Admin privileges required.'
  });
};

/**
 * Check if user owns the task or is admin
 * This middleware expects task ID in req.params.id
 */
const isTaskOwnerOrAdmin = async (req, res, next) => {
  try {
    const taskId = req.params.id;
    
    if (!taskId) {
      return res.status(400).json({
        success: false,
        error: 'Task ID is required'
      });
    }

    // Find the task
    const task = await Task.findById(taskId);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    // Check if user is admin or owns the task (assignedTo or createdBy)
    const isOwner = task.assignedTo.toString() === req.user._id.toString() ||
                    task.createdBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (isOwner || isAdmin) {
      req.task = task; // Attach task to request for use in controllers
      return next();
    }

    return res.status(403).json({
      success: false,
      error: 'Access denied. You do not have permission to perform this action.'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server error during authorization check'
    });
  }
};

module.exports = {
  isAdmin,
  isTaskOwnerOrAdmin
};

