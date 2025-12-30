import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import { taskAPI } from '../utils/api';
import { showToast } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getTask(id);
      const taskData = response.data.data.task;

      // Check if user can edit
      const canEdit =
        taskData.assignedTo._id === user?._id ||
        taskData.createdBy._id === user?._id ||
        isAdmin;

      if (!canEdit) {
        showToast('You do not have permission to edit this task', 'error');
        navigate('/dashboard');
        return;
      }

      setTask(taskData);
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to load task', 'error');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      await taskAPI.updateTask(id, formData);
      showToast('Task updated successfully!', 'success');
      navigate(`/tasks/${id}`);
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!task) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(`/tasks/${id}`)}
          className="mb-4 text-primary hover:text-blue-600 flex items-center"
        >
          ← Back to Task Details
        </button>

        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Task</h1>
          <TaskForm
            initialData={{
              title: task.title,
              description: task.description,
              dueDate: task.dueDate,
              priority: task.priority,
              assignedTo: task.assignedTo._id,
            }}
            onSubmit={handleSubmit}
            submitLabel="Update Task"
            onCancel={() => navigate(`/tasks/${id}`)}
            isAdmin={isAdmin}
            currentUserId={user._id}
          />
        </div>
      </div>
    </div>
  );
};

export default EditTask;

