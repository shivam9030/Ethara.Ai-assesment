import React from 'react';
import { Trash2, CheckCircle, Circle } from 'lucide-react';

const TaskItem = ({ task, onToggleStatus, onDelete }) => {
  const isCompleted = task.status === 'Completed';

  return (
    <div className={`flex items-center justify-between p-4 mb-3 bg-white border rounded-lg shadow-sm transition-all ${isCompleted ? 'border-gray-200 bg-gray-50' : 'border-blue-100 hover:border-blue-300'}`}>
      <div className="flex items-center space-x-3 overflow-hidden">
        <button 
          onClick={() => onToggleStatus(task.id, isCompleted ? 'Pending' : 'Completed')}
          className={`focus:outline-none transition-colors ${isCompleted ? 'text-green-500' : 'text-gray-300 hover:text-blue-500'}`}
        >
          {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
        </button>
        <span className={`text-lg truncate ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
          {task.title}
        </span>
      </div>
      <button 
        onClick={() => onDelete(task.id)}
        className="text-gray-400 hover:text-red-500 focus:outline-none transition-colors ml-4"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
};

export default TaskItem;
