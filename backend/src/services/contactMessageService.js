const ContactMessageModel = require('../models/ContactMessageModel');
const ApiError = require('../utils/ApiError');
const httpStatus = require('../constants/httpStatus');

class ContactMessageService {
    
    async submitMessage(data, clientInfo) {
        // Merge payload with server-derived client IP/UA for auditing
        const insertData = { ...data, ...clientInfo };
        const insertId = await ContactMessageModel.create(insertData);
        
        // Exclude the complete object response for public submission endpoints to prevent leakage
        return { id: insertId, status: 'submitted' };
    }

    async getMessages(queryData) {
        const { page, limit, search, status, sort, order } = queryData;
        const offset = (page - 1) * limit;

        const { rows, total } = await ContactMessageModel.findAll({ search, status, sort, order, limit, offset });

        return {
            messages: rows,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                totalRecords: total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async getMessageById(id) {
        const message = await ContactMessageModel.findById(id);
        if (!message) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Contact message not found.', 'MESSAGE_NOT_FOUND');
        }
        return message;
    }

    async updateStatus(id, status, adminId) {
        const exists = await ContactMessageModel.exists(id);
        if (!exists) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Contact message not found.', 'MESSAGE_NOT_FOUND');
        }

        await ContactMessageModel.updateStatus(id, status, adminId);
        return { id, status };
    }

    async deleteMessage(id) {
        const exists = await ContactMessageModel.exists(id);
        if (!exists) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Contact message not found.', 'MESSAGE_NOT_FOUND');
        }

        await ContactMessageModel.delete(id);
        return true;
    }
}

module.exports = new ContactMessageService();
