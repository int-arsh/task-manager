import React, { useState, useEffect } from 'react';
import TaskList from '../components/TaskList';
import { taskAPI } from '../utils/api';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalTasks: 0 });
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [pagination.currentPage, filters]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: 10,
        ...filters,
      };
      const response = await taskAPI.getTasks(params);
      setTasks(response.data.data.tasks);
      setPagination(response.data.data.pagination);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleTaskUpdate = () => {
    fetchTasks();
  };

  const handleTaskDelete = () => {
    fetchTasks();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Tasks</h1>
        <TaskList
          tasks={tasks}
          pagination={pagination}
          onPageChange={handlePageChange}
          onTaskUpdate={handleTaskUpdate}
          onTaskDelete={handleTaskDelete}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>
    </div>
  );
};

export default Tasks;

