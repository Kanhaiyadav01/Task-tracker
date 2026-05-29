const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
} = require('../controllers/taskController');

// All routes below are protected and require a valid JWT token
router.use(protect);

router.get('/', getTasks);
router.post('/', createTask);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;