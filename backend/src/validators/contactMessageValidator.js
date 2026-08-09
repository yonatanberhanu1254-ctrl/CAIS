const Joi = require('joi');

/**
 * Custom Joi helper to reject HTML tags and basic SQL injection patterns strictly at the validation boundary.
 */
const rejectMaliciousContent = (value, helpers) => {
    const htmlPattern = /<(“[^”]*”|'[^']*'|[^'”>])*>/;
    const sqlPattern = /(\b(SELECT|UPDATE|DELETE|INSERT|DROP|ALTER|CREATE|TRUNCATE)\b)|(--)/i;
    
    if (htmlPattern.test(value)) {
        return helpers.error('any.invalid', { message: 'HTML tags are not allowed' });
    }
    if (sqlPattern.test(value)) {
        return helpers.error('any.invalid', { message: 'SQL fragments are not allowed' });
    }
    return value.trim();
};

const submitMessageSchema = Joi.object({
    full_name: Joi.string().min(3).max(100).custom(rejectMaliciousContent, 'Malicious content check').required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).allow(null, '').messages({
        'string.pattern.base': 'Phone must be a valid E.164 format.'
    }),
    subject: Joi.string().min(5).max(200).custom(rejectMaliciousContent, 'Malicious content check').required(),
    message: Joi.string().min(20).max(5000).custom(rejectMaliciousContent, 'Malicious content check').required()
});

const updateStatusSchema = Joi.object({
    status: Joi.string().valid('Read', 'Unread', 'Archived').required()
});

const getMessagesQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().max(100).allow(''),
    status: Joi.string().valid('Read', 'Unread', 'Archived').allow(''),
    sort: Joi.string().valid('submitted_at', 'full_name', 'status', 'email').default('submitted_at'),
    order: Joi.string().valid('ASC', 'DESC').default('DESC')
});

module.exports = {
    submitMessageSchema,
    updateStatusSchema,
    getMessagesQuerySchema
};
