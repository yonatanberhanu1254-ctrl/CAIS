const contactMessageService = require('../services/contactMessageService');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const httpStatus = require('../constants/httpStatus');

exports.submitMessage = asyncHandler(async (req, res) => {
    // Extract server-level client attributes for spam tracking
    const clientInfo = {
        ip_address: req.ip || req.connection.remoteAddress,
        user_agent: req.headers['user-agent']
    };
    
    const result = await contactMessageService.submitMessage(req.body, clientInfo);
    res.status(httpStatus.CREATED).json(new ApiResponse(true, 'Message submitted successfully', result));
});

exports.getMessages = asyncHandler(async (req, res) => {
    const result = await contactMessageService.getMessages(req.query);
    res.status(httpStatus.OK).json(new ApiResponse(true, 'Messages retrieved successfully', { messages: result.messages }, result.pagination));
});

exports.getMessageById = asyncHandler(async (req, res) => {
    const message = await contactMessageService.getMessageById(req.params.id);
    res.status(httpStatus.OK).json(new ApiResponse(true, 'Message retrieved successfully', { message }));
});

exports.updateStatus = asyncHandler(async (req, res) => {
    const result = await contactMessageService.updateStatus(req.params.id, req.body.status, req.user.id);
    res.status(httpStatus.OK).json(new ApiResponse(true, 'Message status updated successfully', result));
});

exports.deleteMessage = asyncHandler(async (req, res) => {
    await contactMessageService.deleteMessage(req.params.id);
    res.status(httpStatus.OK).json(new ApiResponse(true, 'Message permanently deleted'));
});
