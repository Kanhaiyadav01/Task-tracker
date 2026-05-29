import { useState, useEffect } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';

const formatTime = (seconds) => {
  if (!seconds || seconds === 0) return '0s';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

const statusColors = {
  completed: 'bg-green-100 text-green-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  pending: 'bg-yellow-100 text-yellow-700',
};

const Summary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await API.get('/summary/daily');
        setSummary(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Daily Summary</h1>
          <p className="text-sm text-gray-600 mt-1">{summary?.date || 'Today'}</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500 text-sm">Loading...</div>
        ) : !summary ? (
          <div className="text-center py-12 text-gray-500 text-sm">No data</div>
        ) : (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Time Today', value: formatTime(summary.totalSecondsToday), color: 'text-blue-600' },
                { label: 'Total Tasks', value: summary.counts.total, color: 'text-indigo-600' },
                { label: 'Completed', value: summary.counts.completed, color: 'text-green-600' },
                { label: 'In Progress', value: summary.counts.inProgress, color: 'text-orange-600' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl border-2 border-indigo-100 p-5 hover:shadow-md transition-shadow">
                  <p className="text-xs text-gray-600 font-medium mb-2">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Tasks worked on today */}
            <div className="bg-white rounded-xl border-2 border-indigo-100 p-5 mb-4 hover:shadow-md transition-shadow">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">
                Tasks worked on today
              </h2>
              {summary.tasksWorkedOn.length === 0 ? (
                <p className="text-sm text-gray-500">No tasks tracked today yet.</p>
              ) : (
                <div className="space-y-3">
                  {summary.tasksWorkedOn.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-800 font-medium">{task.title}</span>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[task.status]}`}>
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Time per task with progress bar */}
            <div className="bg-white rounded-xl border-2 border-indigo-100 p-5 hover:shadow-md transition-shadow">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">
                Time per task today
              </h2>
              {summary.timePerTask.length === 0 ? (
                <p className="text-sm text-gray-500">No time logged today yet.</p>
              ) : (
                <div className="space-y-4">
                  {summary.timePerTask.map((item, i) => {
                    const pct =
                      summary.totalSecondsToday > 0
                        ? Math.round((item.totalSeconds / summary.totalSecondsToday) * 100)
                        : 0;
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-800 font-medium">{item.title}</span>
                          <span className="text-sm font-semibold text-indigo-600">
                            {formatTime(item.totalSeconds)}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Summary;