import { useState, useEffect } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [activeStartTime, setActiveStartTime] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
    checkActiveTimer();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await API.get('/tasks');
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // On page load, restore any timer that was already running
  const checkActiveTimer = async () => {
    try {
      const { data } = await API.get('/timelogs/active');
      if (data) {
        setActiveTaskId(data.taskId._id || data.taskId);
        setActiveStartTime(data.startTime);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTimerStart = (taskId, startTime) => {
    setActiveTaskId(taskId);
    setActiveStartTime(startTime);
  };

  const handleTimerStop = () => {
    setActiveTaskId(null);
    setActiveStartTime(null);
    fetchTasks(); // refresh task list to update status
  };

  const handleSaveTask = (savedTask) => {
    setTasks((prev) => {
      const exists = prev.find((t) => t._id === savedTask._id);
      if (exists)
        return prev.map((t) => (t._id === savedTask._id ? savedTask : t));
      return [savedTask, ...prev];
    });
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await API.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      if (activeTaskId === taskId) {
        setActiveTaskId(null);
        setActiveStartTime(null);
      }
    } catch (err) {
      alert('Could not delete task');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const filteredTasks = tasks.filter((t) =>
    filter === 'all' ? true : t.status === filter
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
            <p className="text-sm text-gray-600 mt-1">{tasks.length} total tasks</p>
          </div>
          <button
            onClick={() => { setEditingTask(null); setShowModal(true); }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm px-6 py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all"
          >
            + New Task
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'pending', 'in-progress', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-4 py-2 rounded-full font-medium capitalize transition-all ${
                filter === f
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'bg-white border border-indigo-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Task list */}
        {loading ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            Loading tasks...
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            {filter === 'all'
              ? 'No tasks yet. Create your first one!'
              : `No ${filter} tasks.`}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                activeTaskId={activeTaskId}
                activeStartTime={activeStartTime}
                onTimerStart={handleTimerStart}
                onTimerStop={handleTimerStop}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <TaskModal
          task={editingTask}
          onClose={() => { setShowModal(false); setEditingTask(null); }}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
};

export default Dashboard;