const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'levitica-dev-secret-change-in-production';

/** Attach req.user if valid Bearer token. Does not block if no token. */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    User.findById(decoded.userId)
      .then((user) => {
        if (!user) return res.status(401).json({ message: 'User not found' });
        req.user = user;
        next();
      })
      .catch(() => res.status(401).json({ message: 'Invalid token' }));
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

/** Use after authenticate. Respond 403 if req.user.role is not Admin. */
function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ message: 'Authentication required' });
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

module.exports = { authenticate, requireAdmin, JWT_SECRET };
