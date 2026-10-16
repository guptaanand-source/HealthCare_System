const { createError } = require('../utils/createError');

/**
 * authorize middleware — Role-Based Authorization
 *
 * Used AFTER protect middleware (which sets req.user).
 * Checks that the authenticated user has one of the allowed roles.
 *
 * Usage in routes:
 *   router.get('/admin/users', protect, authorize('admin'), getUsers)
 *   router.post('/consultations', protect, authorize('doctor'), createConsultation)
 *   router.get('/prescriptions/my', protect, authorize('patient', 'doctor'), getMyPrescriptions)
 *
 * This is Authorization (what you're allowed to do),
 * not Authentication (who you are).
 * protect handles Authentication.
 * authorize handles Authorization.
 *
 * @param {...string} roles - allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        createError(
          403,
          `Access denied. This action requires one of the following roles: ${roles.join(', ')}.`
        )
      );
    }
    next();
  };
};

module.exports = authorize;
