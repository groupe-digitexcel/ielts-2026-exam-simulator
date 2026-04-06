const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getSubscriptionRequests,
  approveSubscription,
  rejectSubscription
} = require('../controllers/adminController');

const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/stats', protect, adminOnly, getDashboardStats);
router.get('/subscriptions', protect, adminOnly, getSubscriptionRequests);
router.put('/subscriptions/:id/approve', protect, adminOnly, approveSubscription);
router.put('/subscriptions/:id/reject', protect, adminOnly, rejectSubscription);

module.exports = router;
