const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const {
  startTimer,
  stopTimer,
  getLogsByTask,
  getAllLogs,
  getActiveTimer,
} = require('../controllers/timeLogController');

// All routes protected
router.use(protect);

router.get('/', getAllLogs);
router.get('/active', getActiveTimer);      
router.post('/start/:taskId', startTimer);
router.put('/stop/:taskId', stopTimer);
router.get('/:taskId', getLogsByTask);

module.exports = router;