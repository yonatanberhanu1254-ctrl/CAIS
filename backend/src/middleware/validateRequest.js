const ApiError = require('../utils/ApiError');
const httpStatus = require('../constants/httpStatus');

/**
 * Joi Validation Middleware Factory.
 * Validates request body or query parameters against a Joi schema.
 * @param {Object} schema - Joi validation schema
 * @param {string} [source='body'] - Request property to validate ('body' or 'query')
 * @returns {Function} Express middleware
 */
const validate = (schema, source = 'body') => {
    return (req, res, next) => {
        const dataToValidate = source === 'query' ? req.query : req.body;

        const { error, value } = schema.validate(dataToValidate, {
            abortEarly: false,
            stripUnknown: true,
            allowUnknown: false
        });

        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            throw new ApiError(httpStatus.BAD_REQUEST, errorMessage, 'VALIDATION_ERROR');
        }

        // Replace with validated and sanitized values
        if (source === 'query') {
            req.query = value;
        } else {
            req.body = value;
        }

        next();
    };
};

module.exports = validate;
