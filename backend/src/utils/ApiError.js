/**
 * Custom API Error class for structured error handling.
 * Extends native Error to include HTTP status codes and error codes.
 */
class ApiError extends Error {
    /**
     * @param {number} statusCode - HTTP status code
     * @param {string} message - Human-readable error message
     * @param {string} [errorCode='INTERNAL_ERROR'] - Machine-readable error code
     */
    constructor(statusCode, message, errorCode = 'INTERNAL_ERROR') {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ApiError;
