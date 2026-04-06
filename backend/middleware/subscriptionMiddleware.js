const requireSubscription = (req, res, next) => {
  if (!req.user || Number(req.user.is_subscribed) !== 1) {
    return res.status(403).json({
      message: 'Premium subscription required to access this exam'
    });
  }
  next();
};

module.exports = { requireSubscription };
