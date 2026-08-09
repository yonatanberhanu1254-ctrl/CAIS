const cityInfoService = require('../services/cityInformationService');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { verifyImageContent } = require('../utils/imageHelper');
const ApiError = require('../utils/ApiError');
const httpStatus = require('../constants/httpStatus');

exports.getCityInformation = asyncHandler(async (req, res) => {
    const info = await cityInfoService.getCityInformation(req.query.lang);
    // Return info directly at data level so frontend can access as response.data.data
    res.status(httpStatus.OK).json(new ApiResponse(true, 'City information retrieved successfully', info));
});

exports.createCityInformation = asyncHandler(async (req, res) => {
    const info = await cityInfoService.createCityInformation(req.body, req.user.id);
    res.status(httpStatus.CREATED).json(new ApiResponse(true, 'City information created successfully', info));
});

exports.updateCityInformation = asyncHandler(async (req, res) => {
    const info = await cityInfoService.updateCityInformation(req.body, req.user.id);
    res.status(httpStatus.OK).json(new ApiResponse(true, 'City information updated successfully', info));
});

exports.updateLogo = asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(httpStatus.BAD_REQUEST, 'Please upload a logo image.', 'UPLOAD_MISSING_FILE');
    await verifyImageContent(req.file.path);
    const relativePath = `/uploads/city/${req.file.filename}`;
    const info = await cityInfoService.updateLogo(relativePath, req.user.id);
    res.status(httpStatus.OK).json(new ApiResponse(true, 'City logo updated successfully', info));
});

exports.updateBanner = asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(httpStatus.BAD_REQUEST, 'Please upload a banner image.', 'UPLOAD_MISSING_FILE');
    await verifyImageContent(req.file.path);
    const relativePath = `/uploads/city/${req.file.filename}`;
    const info = await cityInfoService.updateBanner(relativePath, req.user.id);
    res.status(httpStatus.OK).json(new ApiResponse(true, 'City banner updated successfully', info));
});

exports.updateMayorImage = asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(httpStatus.BAD_REQUEST, 'Please upload a mayor image.', 'UPLOAD_MISSING_FILE');
    await verifyImageContent(req.file.path);
    const relativePath = `/uploads/city/${req.file.filename}`;
    const info = await cityInfoService.updateMayorImage(relativePath, req.user.id);
    res.status(httpStatus.OK).json(new ApiResponse(true, 'Mayor image updated successfully', info));
});
