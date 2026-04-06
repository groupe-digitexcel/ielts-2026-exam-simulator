const express = require('express');
const router = express.Router();
const { getExamQuestions } = require('../controllers/examController');
const { protect } = require('../middleware/authMiddleware');
const { requireSubscription } = require('../middleware/subscriptionMiddleware');

router.get('/questions', protect, requireSubscription, getExamQuestions);

module.exports = router;
