import React from 'react';
import { useNavigate } from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import { taskAPI } from '../utils/api';
import { showToast } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

const CreateTask = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const handleSubmit = async (formData) => {
    try {
      // If user is not admin, assign to themselves
      const taskData = {
        ...formData,
        assignedTo: isAdmin ? formData.assignedTo : user._id,
      };

      const response = await taskAPI.createTask(taskData);
      showToast('Task created successfully!', 'success');
      navigate(`/tasks/${response.data.data.task._id}`);
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-primary transition-colors mb-4 group"
          >
            <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Task</h1>
              <p className="text-sm text-gray-500 mt-1">Fill in the details to create a new task</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-blue-600 h-1"></div>
          <div className="p-6 md:p-10">
            <TaskForm
              onSubmit={handleSubmit}
              submitLabel="Create Task"
              onCancel={() => navigate('/dashboard')}
              isAdmin={isAdmin}
              currentUserId={user._id}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;

