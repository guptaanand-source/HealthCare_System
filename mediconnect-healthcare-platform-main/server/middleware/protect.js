const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { createError } = require('../utils/createError');

/**
 * protect middleware — Authentication
 *
 * Verifies that the request contains a valid JWT token.
 * If valid, attaches the user object to req.user so downstream
 * controllers can access it without querying the DB again.
 *
 * Token must be sent as:
 *   Authorization: Bearer <token>
 *
 * Flow:
 *   1. Extract token from Authorization header
 *   2. Verify signature and expiry with jwt.verify
 *   3. Fetch user from DB (to check isActive and get fresh data)
 *   4. Attach user to req.user
 *   5. Call next()
 *
 * Errors:
 *   401 — no token, invalid token, expired token, user not found, user inactive
 */
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createError(401, 'Authentication required. Please log in.'));
  }

  const token = authHeader.split(' ')[1];

  // jwt.verify throws if token is invalid or expired
  // express-async-errors will catch this and forward to errorHandler
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Fetch user — confirm they still exist and are active
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(createError(401, 'User no longer exists. Please log in again.'));
  }

  if (!user.isActive) {
    return next(createError(401, 'Your account has been deactivated. Contact support.'));
  }

  req.user = user;
  next();
};

module.exports = protect;
