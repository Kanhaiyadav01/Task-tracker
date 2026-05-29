const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { getDailySummary } = require('../controllers/summaryController');

router.use(protect);

router.get('/daily', getDailySummary);

module.exports = router;