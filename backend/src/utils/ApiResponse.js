/**
 * Standardized API Response wrapper.
 * Ensures consistent JSON response format across all endpoints.
 */
class ApiResponse {
    /**
     * @param {boolean} success - Whether the operation was successful
     * @param {string} message - Human-readable response message
     * @param {Object} [data=null] - Response payload
     * @param {Object} [pagination=null] - Pagination metadata
     */
    constructor(success, message, data = null, pagination = null) {
        this.success = success;
        this.message = message;
        if (data !== null) this.data = data;
        if (pagination !== null) this.pagination = pagination;
    }
}

module.exports = ApiResponse;
