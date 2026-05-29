const Task = require('../models/Task');

// GET /api/tasks — get all tasks for logged-in user
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/tasks — create a new task
const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = await Task.create({
      userId: req.user._id,
      title,
      description: description || '',
      status: 'pending',
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/tasks/:id — update task (title, description, status)
const updateTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    // 1. Find the task
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // 2. Make sure this task belongs to the logged-in user
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // 3. Update only the fields that were sent
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE /api/tasks/:id — delete a task
const deleteTask = async (req, res) => {
  try {
    // 1. Find the task
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // 2. Make sure this task belongs to the logged-in user
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // 3. Delete it
    await task.deleteOne();
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/tasks/:id — get single task by id
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask, getTaskById };