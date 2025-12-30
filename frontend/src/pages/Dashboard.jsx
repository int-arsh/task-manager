import React, { useState, useEffect, useCallback } from 'react';
import PriorityBoard from '../components/PriorityBoard';
import TaskList from '../components/TaskList';
import { taskAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [view, setView] = useState('board'); // 'board' or 'list'
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getTaskStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-600">Manage your tasks efficiently</p>
        </div>

        {/* Statistics */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border border-blue-200/50 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700 mb-1">Total Tasks</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
                </div>
                <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center shadow-md">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-6 border border-amber-200/50 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-700 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-amber-900">{stats.pending}</p>
                </div>
                <div className="w-14 h-14 bg-amber-500 rounded-xl flex items-center justify-center shadow-md">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-6 border border-green-200/50 hover:shadow-lg transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700 mb-1">Completed</p>
                  <p className="text-3xl font-bold text-green-900">{stats.completed}</p>
                </div>
                <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center shadow-md">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Toggle */}
        <div className="mb-6 flex justify-end">
          <div className="bg-white rounded-xl border border-gray-200 p-1 inline-flex shadow-sm">
            <button
              onClick={() => setView('board')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                view === 'board'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Board
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                view === 'list'
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List
            </button>
          </div>
        </div>

        {/* Content */}
        {view === 'board' ? (
          <PriorityBoard />
        ) : (
          <TasksPage />
        )}
      </div>
    </div>
  );
};

// Tasks Page Component (for list view)
const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalTasks: 0 });
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
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
  }, [pagination.currentPage, filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <TaskList
      tasks={tasks}
      pagination={pagination}
      onPageChange={handlePageChange}
      onTaskUpdate={handleTaskUpdate}
      onTaskDelete={handleTaskDelete}
      filters={filters}
      onFilterChange={handleFilterChange}
    />
  );
};

export default Dashboard;

