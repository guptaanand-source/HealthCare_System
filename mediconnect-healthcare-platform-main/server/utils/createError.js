/**
 * Creates a standardized error object with an HTTP status code.
 * Usage: throw createError(404, 'Doctor not found')
 *
 * Why: Express's built-in Error has no statusCode.
 * This lets us throw descriptive errors in controllers
 * that the errorHandler middleware will interpret correctly.
 */
const createError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

module.exports = { createError };
