import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PriorityColumn from './PriorityColumn';
import Pagination from './Pagination';
import { taskAPI } from '../utils/api';
import { showToast } from '../utils/helpers';

const PriorityBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalTasks: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getTasks({ 
        page: pagination.currentPage,
        limit: 5 // Fetch 5 tasks per page for board view
      });
      setTasks(response.data.data.tasks);
      setPagination(response.data.data.pagination);
    } catch (error) {
      showToast('Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, [pagination.currentPage]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleTaskUpdate = () => {
    // Refresh current page
    fetchTasks();
  };

  const handleTaskDelete = () => {
    // If we deleted the last item on the page and page > 1, go to previous page
    if (tasks.length === 1 && pagination.currentPage > 1) {
      setPagination((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }));
    } else {
      fetchTasks();
    }
  };

  const priorities = ['low', 'medium', 'high', 'urgent'];
  const tasksByPriority = priorities.reduce((acc, priority) => {
    acc[priority] = tasks.filter((task) => task.priority === priority);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Task Board</h2>
          <p className="text-sm text-gray-500 mt-1">Organize tasks by priority</p>
        </div>
        <button
          onClick={() => navigate('/tasks/create')}
          className="btn-primary flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Task</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {priorities.map((priority) => (
          <PriorityColumn
            key={priority}
            priority={priority}
            tasks={tasksByPriority[priority]}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalTasks > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              Showing {((pagination.currentPage - 1) * 20) + 1} to {Math.min(pagination.currentPage * 20, pagination.totalTasks)} of {pagination.totalTasks} tasks
            </p>
          </div>
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PriorityBoard;

