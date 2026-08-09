const authService = require('../services/authService');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const httpStatus = require('../constants/httpStatus');

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Email and password are required');
        }
        const data = await authService.loginUser(email, password);
        res.status(httpStatus.OK).json({ success: true, message: 'Login successful', data });
    } catch (error) {
        next(error);
    }
};

exports.logout = async (req, res, next) => {
    try {
        res.status(httpStatus.OK).json({ success: true, message: 'Logout successful' });
    } catch (error) {
        next(error);
    }
};

exports.getProfile = asyncHandler(async (req, res) => {
    const admin = await authService.getProfile(req.user.id);
    res.status(httpStatus.OK).json(new ApiResponse(true, 'Profile retrieved successfully', { admin }));
});

exports.updateProfile = asyncHandler(async (req, res) => {
    const admin = await authService.updateProfile(req.user.id, req.body);
    res.status(httpStatus.OK).json(new ApiResponse(true, 'Profile updated successfully', { admin }));
});

exports.changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Both current and new password are required.');
    }
    await authService.changePassword(req.user.id, oldPassword, newPassword);
    res.status(httpStatus.OK).json(new ApiResponse(true, 'Password changed successfully'));
});

exports.updateProfileImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No image file provided.');
    }
    const relativePath = `/uploads/sectors/${req.file.filename}`;
    const admin = await authService.updateProfileImage(req.user.id, relativePath);
    res.status(httpStatus.OK).json(new ApiResponse(true, 'Profile image updated successfully', { admin }));
});
