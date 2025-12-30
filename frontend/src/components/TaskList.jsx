import React from 'react';
import { useNavigate } from 'react-router-dom';
import TaskCard from './TaskCard';
import Pagination from './Pagination';

const TaskList = ({ tasks, pagination, onPageChange, onTaskUpdate, onTaskDelete, filters, onFilterChange }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status || ''}
              onChange={(e) => onFilterChange({ ...filters, status: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={filters.priority || ''}
              onChange={(e) => onFilterChange({ ...filters, priority: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value || undefined })}
              placeholder="Search tasks..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => navigate('/tasks/create')}
              className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              + Create Task
            </button>
          </div>
        </div>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-500 text-lg">No tasks found</p>
          <button
            onClick={() => navigate('/tasks/create')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create Your First Task
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onUpdate={onTaskUpdate}
                onDelete={onTaskDelete}
              />
            ))}
          </div>
          {pagination && pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={onPageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default TaskList;

