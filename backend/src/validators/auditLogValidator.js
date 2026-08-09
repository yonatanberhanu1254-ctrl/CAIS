const Joi = require('joi');

const getLogsQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    search: Joi.string().trim().max(100).optional(),
    action: Joi.string().trim().max(100).optional(),
    entityType: Joi.string().trim().max(100).optional(),
    adminId: Joi.number().integer().positive().optional(),
    status: Joi.string().valid('SUCCESS', 'FAILED', 'WARNING', 'ERROR').optional(),
    dateFrom: Joi.date().iso().optional(),
    dateTo: Joi.date().iso().min(Joi.ref('dateFrom')).optional(),
    sort: Joi.string().valid('created_at', 'action', 'entity_type', 'admin_id').optional(),
    order: Joi.string().valid('ASC', 'DESC', 'asc', 'desc').optional()
});

module.exports = {
    getLogsQuerySchema
};
