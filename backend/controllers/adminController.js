const pool = require('../config/db');

const getDashboardStats = async (req, res) => {
  try {
    const [[users]] = await pool.query('SELECT COUNT(*) as totalUsers FROM users');
    const [[results]] = await pool.query('SELECT COUNT(*) as totalResults FROM exam_results');
    const [[subs]] = await pool.query("SELECT COUNT(*) as totalPendingSubscriptions FROM subscription_requests WHERE status = 'pending'");

    res.json({
      totalUsers: users.totalUsers,
      totalResults: results.totalResults,
      totalPendingSubscriptions: subs.totalPendingSubscriptions
    });
  } catch (error) {
    console.error('getDashboardStats error:', error);
    res.status(500).json({ message: 'Failed to fetch admin dashboard stats' });
  }
};

const getSubscriptionRequests = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT sr.*, u.name, u.email
      FROM subscription_requests sr
      JOIN users u ON sr.user_id = u.id
      ORDER BY sr.created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error('getSubscriptionRequests error:', error);
    res.status(500).json({ message: 'Failed to fetch subscription requests' });
  }
};

const approveSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      'SELECT * FROM subscription_requests WHERE id = ?',
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Subscription request not found' });
    }

    const request = rows[0];

    await pool.query(
      "UPDATE subscription_requests SET status = 'approved' WHERE id = ?",
      [id]
    );

    await pool.query(
      'UPDATE users SET is_subscribed = 1 WHERE id = ?',
      [request.user_id]
    );

    res.json({ message: 'Subscription approved successfully' });
  } catch (error) {
    console.error('approveSubscription error:', error);
    res.status(500).json({ message: 'Failed to approve subscription' });
  }
};

const rejectSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "UPDATE subscription_requests SET status = 'rejected' WHERE id = ?",
      [id]
    );

    res.json({ message: 'Subscription rejected successfully' });
  } catch (error) {
    console.error('rejectSubscription error:', error);
    res.status(500).json({ message: 'Failed to reject subscription' });
  }
};

module.exports = {
  getDashboardStats,
  getSubscriptionRequests,
  approveSubscription,
  rejectSubscription
};
