const Task = require('../models/Task');
const TimeLog = require('../models/TimeLog');

// GET daily summary — get today's summary for logged-in user
const getDailySummary = async (req, res) => {
  try {
    // 1. Build today's date range (midnight to now)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // 2. Get all tasks for this user
    const allTasks = await Task.find({ userId: req.user._id });

    // 3. Get all time logs created today for this user
    const todayLogs = await TimeLog.find({
      userId: req.user._id,
      startTime: { $gte: todayStart, $lte: todayEnd },
    }).populate('taskId', 'title status');

    // 4. Find unique tasks that were worked on today
    const workedTaskIds = new Set(
      todayLogs.map((log) => log.taskId?._id?.toString())
    );
    const tasksWorkedOn = allTasks.filter((task) =>
      workedTaskIds.has(task._id.toString())
    );

    // 5. Total time tracked today (sum of all completed session durations)
    const totalSecondsToday = todayLogs.reduce(
      (sum, log) => sum + (log.duration || 0),
      0
    );

    // 6. Count by status across ALL user tasks
    const completedTasks = allTasks.filter((t) => t.status === 'completed');
    const inProgressTasks = allTasks.filter((t) => t.status === 'in-progress');
    const pendingTasks = allTasks.filter((t) => t.status === 'pending');

    // 7. Build time per task (for the summary cards)
    const timePerTask = {};
    todayLogs.forEach((log) => {
      const taskId = log.taskId?._id?.toString();
      const taskTitle = log.taskId?.title || 'Unknown';
      if (!taskId) return;
      if (!timePerTask[taskId]) {
        timePerTask[taskId] = { title: taskTitle, totalSeconds: 0 };
      }
      timePerTask[taskId].totalSeconds += log.duration || 0;
    });

    // 8. Send response
    res.status(200).json({
      date: todayStart.toDateString(),
      totalSecondsToday,
      tasksWorkedOn: tasksWorkedOn.map((t) => ({
        id: t._id,
        title: t.title,
        status: t.status,
      })),
      timePerTask: Object.values(timePerTask),
      counts: {
        total: allTasks.length,
        completed: completedTasks.length,
        inProgress: inProgressTasks.length,
        pending: pendingTasks.length,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getDailySummary };