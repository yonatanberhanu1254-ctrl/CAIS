const AuditLogModel = require('../models/AuditLogModel');
const ApiError = require('../utils/ApiError');
const httpStatus = require('../constants/httpStatus');

class AuditLogService {
    /**
     * Helper to write audit logs from anywhere in the application.
     * Standardizes insertion and throws strict ApiErrors on failure to ensure compliance.
     * @param {Object} data - Audit log payload parameters
     * @param {Object} [executor] - Optional database connection for transaction wrapping
     * @returns {Promise<number>} Inserted record ID
     */
    static async recordActivity(data, executor = undefined) {
        try {
            return await AuditLogModel.create({
                admin_id: data.adminId,
                action: data.action,
                entity_type: data.entityType,
                entity_id: data.entityId,
                description: data.description,
                ip_address: data.ipAddress,
                user_agent: data.userAgent,
                request_id: data.requestId,
                status: data.status || 'SUCCESS'
            }, executor);
        } catch (error) {
            // In high-compliance environments, failing to write an audit log must halt the transaction
            throw new ApiError(
                httpStatus.INTERNAL_SERVER_ERROR, 
                'Failed to record secure audit log', 
                'AUDIT_LOG_FAILED'
            );
        }
    }

    /**
     * Retrieves paginated and filtered logs based on business logic conditions.
     * @param {Object} query - Extracted controller query parameters
     * @returns {Promise<Object>} Output payload with items and pagination data
     */
    static async getLogs(query) {
        const page = parseInt(query.page, 10) || 1;
        const limit = parseInt(query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        const filters = {
            search: query.search,
            action: query.action,
            entityType: query.entityType,
            adminId: query.adminId,
            status: query.status,
            dateFrom: query.dateFrom,
            dateTo: query.dateTo,
            sort: query.sort,
            order: query.order,
            limit,
            offset
        };

        try {
            const result = await AuditLogModel.findAll(filters);

            return {
                logs: result.rows,
                pagination: {
                    total: result.total,
                    page,
                    limit,
                    totalPages: Math.ceil(result.total / limit)
                }
            };
        } catch (error) {
            throw new ApiError(
                httpStatus.INTERNAL_SERVER_ERROR, 
                'Failed to retrieve audit logs', 
                'AUDIT_LOGS_RETRIEVAL_FAILED'
            );
        }
    }

    /**
     * Retrieves a single log by its immutable ID.
     * @param {number} id 
     * @returns {Promise<Object>}
     */
    static async getLogById(id) {
        const log = await AuditLogModel.findById(id);
        if (!log) {
            throw new ApiError(
                httpStatus.NOT_FOUND, 
                'Audit log not found', 
                'AUDIT_LOG_NOT_FOUND'
            );
        }
        return log;
    }

    /**
     * Permanently deletes a log from the database.
     * @param {number} id 
     * @returns {Promise<boolean>}
     */
    static async deleteLog(id) {
        const exists = await AuditLogModel.exists(id);
        if (!exists) {
            throw new ApiError(
                httpStatus.NOT_FOUND, 
                'Audit log not found', 
                'AUDIT_LOG_NOT_FOUND'
            );
        }

        const success = await AuditLogModel.delete(id);
        if (!success) {
            throw new ApiError(
                httpStatus.INTERNAL_SERVER_ERROR, 
                'Failed to delete audit log', 
                'AUDIT_LOG_DELETE_FAILED'
            );
        }
        
        return true;
    }
}

module.exports = AuditLogService;
