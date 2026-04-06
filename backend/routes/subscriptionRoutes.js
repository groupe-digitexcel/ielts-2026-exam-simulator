const express = require('express');
const router = express.Router();
const { getSubscriptionInfo, requestSubscription } = require('../controllers/subscriptionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/info', protect, getSubscriptionInfo);
router.post('/request', protect, requestSubscription);

module.exports = router;
