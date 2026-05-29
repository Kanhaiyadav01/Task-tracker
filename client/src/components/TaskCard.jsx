import { useState } from 'react';
import API from '../api/axios';
import Timer from './Timer';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
};

const TaskCard = ({
  task,
  activeTaskId,
  activeStartTime,
  onTimerStart,
  onTimerStop,
  onEdit,
  onDelete,
}) => {
  const [loadingTimer, setLoadingTimer] = useState(false);
  const isActive = activeTaskId === task._id;

  const handleStart = async () => {
    setLoadingTimer(true);
    try {
      const { data } = await API.post(`/timelogs/start/${task._id}`);
      onTimerStart(task._id, data.startTime);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not start timer');
    } finally {
      setLoadingTimer(false);
    }
  };

  const handleStop = async () => {
    setLoadingTimer(true);
    try {
      await API.put(`/timelogs/stop/${task._id}`);
      onTimerStop();
    } catch (err) {
      alert(err.response?.data?.message || 'Could not stop timer');
    } finally {
      setLoadingTimer(false);
    }
  };

  return (
    <div
      className={`bg-white rounded-xl border-2 p-5 flex flex-col gap-3 transition-all shadow-sm hover:shadow-md ${
        isActive ? 'border-green-400 shadow-md' : 'border-indigo-100 hover:border-indigo-200'
      }`}
    >
      {/* Top row: title + status badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-gray-600 text-xs mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 ${statusColors[task.status]}`}
        >
          {task.status}
        </span>
      </div>

      {/* Bottom row: live timer + action buttons */}
      <div className="flex items-center justify-between">
        <Timer startTime={activeStartTime} isRunning={isActive} />

        <div className="flex items-center gap-2 ml-auto">
          {task.status !== 'completed' &&
            (isActive ? (
              <button
                onClick={handleStop}
                disabled={loadingTimer}
                className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                ■ Stop
              </button>
            ) : (
              <button
                onClick={handleStart}
                disabled={loadingTimer || !!activeTaskId}
                title={activeTaskId ? 'Stop the current timer first' : ''}
                className="bg-green-500 text-white text-xs px-3 py-1.5 rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 transition-colors"
              >
                ▶ Start
              </button>
            ))}

          <button
            onClick={() => onEdit(task)}
            className="text-xs text-gray-500 hover:text-blue-600 px-2 py-1.5 font-medium transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="text-xs text-gray-500 hover:text-red-600 px-2 py-1.5 font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;