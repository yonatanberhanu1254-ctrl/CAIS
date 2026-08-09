const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const httpStatus = require('../constants/httpStatus');

/**
 * JWT Token Verification Middleware.
 * Extracts the Bearer token from the Authorization header,
 * verifies it against the JWT_SECRET, and attaches the decoded user to req.user.
 */
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required. Please provide a valid Bearer token.', 'AUTH_TOKEN_MISSING');
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Session expired. Please log in again.', 'AUTH_TOKEN_EXPIRED');
        }
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid authentication token.', 'AUTH_TOKEN_INVALID');
    }
};

module.exports = verifyToken;
