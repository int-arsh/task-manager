import React from 'react';
import TaskCard from './TaskCard';
import { getPriorityColor } from '../utils/helpers';

const PriorityColumn = ({ priority, tasks, onTaskUpdate, onTaskDelete }) => {
  const priorityLabels = {
    low: 'Low Priority',
    medium: 'Medium Priority',
    high: 'High Priority',
    urgent: 'Urgent',
  };

  const priorityStyles = {
    urgent: 'border-red-200 bg-red-50/50',
    high: 'border-orange-200 bg-orange-50/50',
    medium: 'border-yellow-200 bg-yellow-50/50',
    low: 'border-green-200 bg-green-50/50',
  };

  const priorityHeaderStyles = {
    urgent: 'bg-red-500 text-white',
    high: 'bg-orange-500 text-white',
    medium: 'bg-yellow-500 text-white',
    low: 'bg-green-500 text-white',
  };

  return (
    <div className={`flex-1 rounded-xl border-2 p-4 min-h-[500px] ${priorityStyles[priority] || priorityStyles.medium}`}>
      <div className={`${priorityHeaderStyles[priority]} rounded-lg px-4 py-2.5 mb-4 shadow-sm`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm uppercase tracking-wide">
            {priorityLabels[priority]}
          </h3>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">
            {tasks.length}
          </span>
        </div>
      </div>
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-sm">No tasks</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onUpdate={onTaskUpdate}
              onDelete={onTaskDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default React.memo(PriorityColumn);

