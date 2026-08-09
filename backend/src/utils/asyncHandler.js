/**
 * Async handler wrapper to eliminate repetitive try-catch blocks in controllers.
 * Catches any errors thrown by async route handlers and forwards them to Express error middleware.
 * @param {Function} fn - Async Express route handler
 * @returns {Function} Wrapped handler with error forwarding
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
