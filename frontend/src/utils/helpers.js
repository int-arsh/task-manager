import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from 'date-fns';

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @param {string} formatStr - Format string (default: 'MMM dd, yyyy')
 * @returns {string} Formatted date
 */
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return '';
  try {
    return format(new Date(date), formatStr);
  } catch (error) {
    return '';
  }
};

/**
 * Get relative time (e.g., "2 days ago", "in 3 hours")
 * @param {Date|string} date - Date to format
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch (error) {
    return '';
  }
};

/**
 * Check if date is overdue
 * @param {Date|string} date - Date to check
 * @param {string} status - Task status
 * @returns {boolean} True if overdue
 */
export const isOverdue = (date, status) => {
  if (!date || status === 'completed') return false;
  try {
    return isPast(new Date(date)) && !isToday(new Date(date));
  } catch (error) {
    return false;
  }
};

/**
 * Get priority color class
 * @param {string} priority - Priority level
 * @returns {string} Tailwind color class
 */
export const getPriorityColor = (priority) => {
  const colors = {
    low: 'bg-priority-low text-white',
    medium: 'bg-priority-medium text-white',
    high: 'bg-priority-high text-white',
    urgent: 'bg-priority-urgent text-white',
  };
  return colors[priority] || colors.medium;
};

/**
 * Get priority border color class
 * @param {string} priority - Priority level
 * @returns {string} Tailwind border color class
 */
export const getPriorityBorderColor = (priority) => {
  const colors = {
    low: 'border-priority-low',
    medium: 'border-priority-medium',
    high: 'border-priority-high',
    urgent: 'border-priority-urgent',
  };
  return colors[priority] || colors.medium;
};

/**
 * Get priority text color class
 * @param {string} priority - Priority level
 * @returns {string} Tailwind text color class
 */
export const getPriorityTextColor = (priority) => {
  const colors = {
    low: 'text-priority-low',
    medium: 'text-priority-medium',
    high: 'text-priority-high',
    urgent: 'text-priority-urgent',
  };
  return colors[priority] || colors.medium;
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Show toast notification
 * @param {string} message - Message to show
 * @param {string} type - Type: 'success', 'error', 'info'
 */
export const showToast = (message, type = 'info') => {
  // Simple toast implementation - can be enhanced with a toast library
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${
    type === 'success' ? 'bg-success' : type === 'error' ? 'bg-danger' : 'bg-primary'
  }`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
};

