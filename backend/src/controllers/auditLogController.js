const auditLogService = require('../services/auditLogService');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const httpStatus = require('../constants/httpStatus');

/**
 * Parses queries and dispatches to Service layer.
 * Thin controller design isolates network bounds from business rules.
 */
exports.getLogs = asyncHandler(async (req, res) => {
    const result = await auditLogService.getLogs(req.query);
    res.status(httpStatus.OK).json(
        new ApiResponse(true, 'Audit logs retrieved successfully', { logs: result.logs }, result.pagination)
    );
});

/**
 * Retrieves a single audit log via URL param extraction.
 */
exports.getLogById = asyncHandler(async (req, res) => {
    const log = await auditLogService.getLogById(req.params.id);
    res.status(httpStatus.OK).json(
        new ApiResponse(true, 'Audit log retrieved successfully', { log })
    );
});

/**
 * Instructs the Service layer to delete the log.
 * Enforces self-logging: A SuperAdmin deleting an audit log forces an audit log 
 * of the deletion itself to ensure chain of custody is maintained.
 */
exports.deleteLog = asyncHandler(async (req, res) => {
    await auditLogService.deleteLog(req.params.id);
    
    // Transparently write a new log representing the deletion of the older log.
    await auditLogService.recordActivity({
        adminId: req.user.id,
        action: 'DELETE_AUDIT_LOG',
        entityType: 'AuditLog',
        entityId: req.params.id,
        description: `Permanently deleted audit log ID: ${req.params.id}`,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'],
        requestId: req.id,
        status: 'SUCCESS'
    });

    res.status(httpStatus.OK).json(
        new ApiResponse(true, 'Audit log permanently deleted')
    );
});
