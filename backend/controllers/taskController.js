const Task = require('../models/Task');
const User = require('../models/User');

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks for logged-in user (or all tasks if admin)
 * @access  Private
 */
const getTasks = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, priority, search, all } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    let query = {};

    // If admin and all=true, show all tasks
    if (req.user.role === 'admin' && all === 'true') {
      // No filter - show all tasks
    } else if (req.user.role === 'admin') {
      // Admin without all=true: show tasks assigned to them OR created by them (so they see tasks they created for others)
      query.$or = [
        { assignedTo: req.user._id },
        { createdBy: req.user._id }
      ];
    } else {
      // Normal users: ONLY see tasks assigned to them
      query.assignedTo = req.user._id;
    }

    // Apply filters
    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    // Apply search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Execute query with pagination
    const tasks = await Task.find(query)
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const totalTasks = await Task.countDocuments(query);
    const totalPages = Math.ceil(totalTasks / limitNum);

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalTasks,
          limit: limitNum
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/tasks/:id
 * @desc    Get single task by ID
 * @access  Private
 */
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'username email')
      .populate('createdBy', 'username email');

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    // Check if user has access (owns task or is admin)
    const isOwner = task.assignedTo._id.toString() === req.user._id.toString() ||
                    task.createdBy._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You do not have permission to view this task.'
      });
    }

    res.json({
      success: true,
      data: { task }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/tasks
 * @desc    Create new task
 * @access  Private
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, priority = 'medium', assignedTo } = req.body;

    // If user is not admin, they can only assign tasks to themselves
    let assignedUserId = assignedTo;
    if (req.user.role !== 'admin') {
      assignedUserId = req.user._id;
    }

    // Verify assigned user exists
    const assignedUser = await User.findById(assignedUserId);
    if (!assignedUser) {
      return res.status(404).json({
        success: false,
        error: 'Assigned user not found'
      });
    }

    // Create task
    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      assignedTo: assignedUserId,
      createdBy: req.user._id
    });

    // Populate and return
    await task.populate('assignedTo', 'username email');
    await task.populate('createdBy', 'username email');

    res.status(201).json({
      success: true,
      data: { task }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update task
 * @access  Private
 */
const updateTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, priority, assignedTo } = req.body;
    const task = req.task; // Already fetched and checked by isTaskOwnerOrAdmin middleware

    // Update fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (priority !== undefined) task.priority = priority;

    // Only admin can change assignedTo
    if (assignedTo !== undefined) {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Only admins can change task assignment'
        });
      }

      // Verify assigned user exists
      const assignedUser = await User.findById(assignedTo);
      if (!assignedUser) {
        return res.status(404).json({
          success: false,
          error: 'Assigned user not found'
        });
      }

      task.assignedTo = assignedTo;
    }

    // Save updated task
    await task.save();

    // Populate and return
    await task.populate('assignedTo', 'username email');
    await task.populate('createdBy', 'username email');

    res.json({
      success: true,
      data: { task }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete task
 * @access  Private
 */
const deleteTask = async (req, res, next) => {
  try {
    const task = req.task; // Already fetched and checked by isTaskOwnerOrAdmin middleware

    await Task.findByIdAndDelete(task._id);

    res.json({
      success: true,
      data: { message: 'Task deleted successfully' }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/tasks/:id/status
 * @desc    Update task status
 * @access  Private
 */
const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const task = req.task; // Already fetched and checked by isTaskOwnerOrAdmin middleware

    task.status = status;
    await task.save();

    // Populate and return
    await task.populate('assignedTo', 'username email');
    await task.populate('createdBy', 'username email');

    res.json({
      success: true,
      data: { task }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/tasks/:id/priority
 * @desc    Update task priority
 * @access  Private
 */
const updatePriority = async (req, res, next) => {
  try {
    const { priority } = req.body;
    const task = req.task; // Already fetched and checked by isTaskOwnerOrAdmin middleware

    task.priority = priority;
    await task.save();

    // Populate and return
    await task.populate('assignedTo', 'username email');
    await task.populate('createdBy', 'username email');

    res.json({
      success: true,
      data: { task }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/tasks/stats
 * @desc    Get task statistics for current user
 * @access  Private
 */
const getTaskStats = async (req, res, next) => {
  try {
    // Build query (same logic as getTasks)
    let query = {};

    // If admin and all=true, show all tasks
    if (req.user.role === 'admin' && req.query.all === 'true') {
      // No filter - show all tasks
    } else if (req.user.role === 'admin') {
      // Admin without all=true: show tasks assigned to them OR created by them
      query.$or = [
        { assignedTo: req.user._id },
        { createdBy: req.user._id }
      ];
    } else {
      // Normal users: ONLY see tasks assigned to them
      query.assignedTo = req.user._id;
    }

    // Get counts
    const total = await Task.countDocuments(query);
    const pending = await Task.countDocuments({ ...query, status: 'pending' });
    const completed = await Task.countDocuments({ ...query, status: 'completed' });

    res.json({
      success: true,
      data: {
        total,
        pending,
        completed
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  updateStatus,
  updatePriority,
  getTaskStats
};

