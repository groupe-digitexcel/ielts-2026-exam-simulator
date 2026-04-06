const pool = require('../config/db');

const getSubscriptionInfo = async (req, res) => {
  res.json({
    paymentProvider: process.env.PAYMENT_PROVIDER || 'manual',
    momo: {
      name: process.env.MOMO_NAME || '',
      number: process.env.MOMO_NUMBER || ''
    },
    orangeMoney: {
      name: process.env.OM_NAME || '',
      number: process.env.OM_NUMBER || ''
    }
  });
};

const requestSubscription = async (req, res) => {
  try {
    const { paymentMethod, transactionRef } = req.body;

    if (!paymentMethod || !transactionRef) {
      return res.status(400).json({ message: 'Payment method and transaction reference are required' });
    }

    await pool.query(
      'INSERT INTO subscription_requests (user_id, payment_method, transaction_ref, status) VALUES (?, ?, ?, ?)',
      [req.user.id, paymentMethod, transactionRef, 'pending']
    );

    res.json({ message: 'Subscription request submitted successfully' });
  } catch (error) {
    console.error('requestSubscription error:', error);
    res.status(500).json({ message: 'Failed to submit subscription request' });
  }
};

module.exports = { getSubscriptionInfo, requestSubscription };
