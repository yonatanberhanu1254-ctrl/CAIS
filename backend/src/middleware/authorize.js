const ApiError = require('../utils/ApiError');
const httpStatus = require('../constants/httpStatus');

/**
 * Role-Based Access Control (RBAC) Middleware Factory.
 * Restricts access to routes based on the authenticated user's role.
 *
 * IMPORTANT: SuperAdmin automatically bypasses all role restrictions.
 * SuperAdmin has implicit full access to every administrative endpoint.
 * DepartmentAdmin and other roles are strictly limited to allowedRoles.
 *
 * @param {...string} allowedRoles - Roles permitted to access the route (SuperAdmin bypass is always applied)
 * @returns {Function} Express middleware
 */
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required.', 'AUTH_REQUIRED');
        }

        // SuperAdmin has full system-wide access — bypass all role checks
        if (req.user.role === 'SuperAdmin') {
            return next();
        }

        if (!allowedRoles.includes(req.user.role)) {
            throw new ApiError(httpStatus.FORBIDDEN, 'Insufficient permissions to access this resource.', 'RBAC_DENIED');
        }

        next();
    };
};

module.exports = authorize;
