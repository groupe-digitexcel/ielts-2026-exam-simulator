const express = require('express');
const router = express.Router();
const { submitExam, getMyResults } = require('../controllers/resultController');
const { protect } = require('../middleware/authMiddleware');
const { requireSubscription } = require('../middleware/subscriptionMiddleware');

router.post('/submit', protect, requireSubscription, submitExam);
router.get('/my-results', protect, getMyResults);

module.exports = router;
