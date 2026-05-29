const TimeLog = require('../models/TimeLog');
const Task = require('../models/Task');

// POST /api/timelogs/start/:taskId — start a timer session
const startTimer = async (req, res) => {
  try {
    const { taskId } = req.params;

    // 1. Check task exists and belongs to user
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // 2. Check if a session is already running for this task
    const activeSession = await TimeLog.findOne({
      taskId,
      userId: req.user._id,
      endTime: null,
    });
    if (activeSession) {
      return res.status(400).json({
        message: 'Timer already running for this task',
        session: activeSession,
      });
    }

    // 3. Create a new session
    const session = await TimeLog.create({
      userId: req.user._id,
      taskId,
      startTime: new Date(),
    });

    // 4. Also update task status to in-progress
    task.status = 'in-progress';
    await task.save();

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/timelogs/stop/:taskId — stop the active timer session
const stopTimer = async (req, res) => {
  try {
    const { taskId } = req.params;

    // 1. Find the active (running) session for this task
    const session = await TimeLog.findOne({
      taskId,
      userId: req.user._id,
      endTime: null,
    });
    if (!session) {
      return res.status(404).json({ message: 'No active timer found for this task' });
    }

    // 2. Set endTime and calculate duration in seconds
    const endTime = new Date();
    const duration = Math.floor((endTime - session.startTime) / 1000);

    session.endTime = endTime;
    session.duration = duration;
    await session.save();

    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/timelogs/:taskId — get all logs for a specific task
const getLogsByTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Check task belongs to user
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const logs = await TimeLog.find({ taskId, userId: req.user._id }).sort({
      startTime: -1,
    });

    // Calculate total time spent on this task (sum of all durations)
    const totalSeconds = logs.reduce((sum, log) => sum + log.duration, 0);

    res.status(200).json({ logs, totalSeconds });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/timelogs — get all logs for logged-in user
const getAllLogs = async (req, res) => {
  try {
    const logs = await TimeLog.find({ userId: req.user._id })
      .populate('taskId', 'title status')  // brings in task title + status
      .sort({ startTime: -1 });

    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/timelogs/active — check if any task has a running timer
const getActiveTimer = async (req, res) => {
  try {
    const activeSession = await TimeLog.findOne({
      userId: req.user._id,
      endTime: null,
    }).populate('taskId', 'title status');

    // null means no active timer — 
    res.status(200).json(activeSession || null);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  startTimer,
  stopTimer,
  getLogsByTask,
  getAllLogs,
  getActiveTimer,
};