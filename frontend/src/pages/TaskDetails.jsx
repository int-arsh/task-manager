import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { taskAPI } from '../utils/api';
import { formatDate, getRelativeTime, getPriorityTextColor, isOverdue } from '../utils/helpers';
import { showToast } from '../utils/helpers';
import ConfirmDialog from '../components/ConfirmDialog';
import { useAuth } from '../context/AuthContext';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getTask(id);
      setTask(response.data.data.task);
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to load task', 'error');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await taskAPI.deleteTask(id);
      showToast('Task deleted successfully', 'success');
      navigate('/dashboard');
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to delete task', 'error');
    }
  };

  const handleStatusToggle = async () => {
    try {
      const newStatus = task.status === 'pending' ? 'completed' : 'pending';
      await taskAPI.updateStatus(id, newStatus);
      showToast(`Task marked as ${newStatus}`, 'success');
      fetchTask();
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to update status', 'error');
    }
  };

  const canEdit = task && (task.assignedTo._id === user?._id || task.createdBy._id === user?._id || isAdmin);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 text-lg">Task not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-4 text-primary hover:text-blue-600 flex items-center"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    task.status === 'completed'
                      ? 'bg-success text-white'
                      : 'bg-warning text-white'
                  }`}
                >
                  {task.status}
                </span>
              </div>
              <p className={`text-sm ${getPriorityTextColor(task.priority)} font-medium`}>
                {task.priority.toUpperCase()} Priority
              </p>
            </div>
            <div className="flex space-x-2">
              {canEdit && (
                <button
                  onClick={() => navigate(`/tasks/${id}/edit`)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Edit
                </button>
              )}
              {canEdit && (
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="px-4 py-2 bg-danger text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
            <p className="text-gray-600 whitespace-pre-wrap">{task.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Due Date</h3>
              <p className={`text-gray-900 ${overdue ? 'text-danger font-semibold' : ''}`}>
                {formatDate(task.dueDate)} {overdue && '⚠️ Overdue'}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Priority</h3>
              <p className={`${getPriorityTextColor(task.priority)} font-medium`}>
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Assigned To</h3>
              <p className="text-gray-900">
                {task.assignedTo.username} ({task.assignedTo.email})
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Created By</h3>
              <p className="text-gray-900">
                {task.createdBy.username} ({task.createdBy.email})
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Created</h3>
              <p className="text-gray-900">{formatDate(task.createdAt)}</p>
              <p className="text-sm text-gray-500">{getRelativeTime(task.createdAt)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h3>
              <p className="text-gray-900">{formatDate(task.updatedAt)}</p>
              <p className="text-sm text-gray-500">{getRelativeTime(task.updatedAt)}</p>
            </div>
          </div>

          <div className="pt-6 border-t">
            <button
              onClick={handleStatusToggle}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                task.status === 'pending'
                  ? 'bg-success text-white hover:bg-green-600'
                  : 'bg-warning text-white hover:bg-yellow-500'
              }`}
            >
              Mark as {task.status === 'pending' ? 'Completed' : 'Pending'}
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
        confirmText="Delete"
      />
    </div>
  );
};

export default TaskDetails;

