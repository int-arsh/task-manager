import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate, isOverdue, getPriorityBorderColor } from '../utils/helpers';
import { taskAPI } from '../utils/api';
import { showToast } from '../utils/helpers';

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const navigate = useNavigate();
  const overdue = isOverdue(task.dueDate, task.status);
  const isCompleted = task.status === 'completed';

  const handleStatusToggle = async (e) => {
    e.stopPropagation();
    try {
      const newStatus = task.status === 'pending' ? 'completed' : 'pending';
      await taskAPI.updateStatus(task._id, newStatus);
      showToast(`Task marked as ${newStatus}`, 'success');
      if (onUpdate) onUpdate();
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to update status', 'error');
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskAPI.deleteTask(task._id);
        showToast('Task deleted successfully', 'success');
        if (onDelete) onDelete();
      } catch (error) {
        showToast(error.response?.data?.error || 'Failed to delete task', 'error');
      }
    }
  };

  const priorityColors = {
    urgent: 'border-l-red-500 bg-red-50/30',
    high: 'border-l-orange-500 bg-orange-50/30',
    medium: 'border-l-yellow-500 bg-yellow-50/30',
    low: 'border-l-green-500 bg-green-50/30',
  };

  return (
    <div
      className={`bg-white rounded-xl border-l-4 p-4 mb-3 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
        priorityColors[task.priority] || priorityColors.medium
      } ${isCompleted ? 'opacity-60' : ''} border border-gray-100`}
      onClick={() => navigate(`/tasks/${task._id}`)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start space-x-3 flex-1">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={handleStatusToggle}
            onClick={(e) => e.stopPropagation()}
            className="mt-1 w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary focus:ring-2 cursor-pointer"
          />
          <div className="flex-1 min-w-0">
            <h3
              className={`font-semibold text-gray-900 mb-1 ${
                isCompleted ? 'line-through text-gray-400' : ''
              }`}
            >
              {task.title}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2">{task.description}</p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(e);
          }}
          className="ml-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          title="Delete task"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <span className={`text-xs font-medium ${overdue && !isCompleted ? 'text-red-600' : 'text-gray-500'}`}>
          {overdue && !isCompleted && (
            <span className="inline-flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </span>
          )}
          {formatDate(task.dueDate)}
        </span>
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${
            task.priority === 'urgent'
              ? 'bg-red-100 text-red-700'
              : task.priority === 'high'
              ? 'bg-orange-100 text-orange-700'
              : task.priority === 'medium'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          {task.priority}
        </span>
      </div>
    </div>
  );
};

export default React.memo(TaskCard);

