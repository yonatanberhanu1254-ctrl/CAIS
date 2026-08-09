const sectorService = require('../services/sectorService');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { verifyImageContent } = require('../utils/imageHelper');
const ApiError = require('../utils/ApiError');
const httpStatus = require('../constants/httpStatus');
const path = require('path');
const fs = require('fs');

/** GET /api/v1/sectors/all - Public: active sectors */
exports.getAllActiveSectors = asyncHandler(async (req, res) => {
    const sectors = await sectorService.getAllActiveSectors(req.query.lang);
    res.status(httpStatus.OK).json(new ApiResponse(true, 'Active sectors retrieved successfully', sectors));
});

/** GET /api/v1/sectors - Admin: paginated sectors */
exports.getSectors = asyncHandler(async (req, res) => {
    const result = await sectorService.getSectors(req.query);
    res.status(httpStatus.OK).json(new ApiResponse(true, 'Sectors retrieved successfully', result));
});

/** GET /api/v1/sectors/:id - Single sector */
exports.getSectorById = asyncHandler(async (req, res) => {
    const sector = await sectorService.getSectorById(req.params.id, req.query.lang);
    res.status(httpStatus.OK).json(new ApiResponse(true, 'Sector retrieved successfully', sector));
});

/** POST /api/v1/sectors - Create */
exports.createSector = asyncHandler(async (req, res) => {
    const sector = await sectorService.createSector(req.body, req.user.id);
    res.status(httpStatus.CREATED).json(new ApiResponse(true, 'Sector created successfully', { sector }));
});

/** PUT /api/v1/sectors/:id - Update */
exports.updateSector = asyncHandler(async (req, res) => {
    const sector = await sectorService.updateSector(req.params.id, req.body, req.user.id);
    res.status(httpStatus.OK).json(new ApiResponse(true, 'Sector updated successfully', { sector }));
});

/** PATCH /api/v1/sectors/:id/image - Upload image */
exports.uploadSectorImage = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Please upload an image file.', 'UPLOAD_MISSING_FILE');
    }
    await verifyImageContent(req.file.path);
    const relativePath = `/uploads/sectors/${req.file.filename}`;
    const sector = await sectorService.updateSectorImage(req.params.id, relativePath, req.user.id);
    res.status(httpStatus.OK).json(new ApiResponse(true, 'Sector image updated successfully', { sector }));
});

/** PATCH /api/v1/sectors/:id/status - Toggle active/inactive */
exports.toggleSectorStatus = asyncHandler(async (req, res) => {
    const { is_active } = req.body;
    if (is_active === undefined) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'is_active field is required.', 'MISSING_STATUS');
    }
    const sector = await sectorService.toggleStatus(req.params.id, Boolean(is_active), req.user.id);
    res.status(httpStatus.OK).json(new ApiResponse(true, `Sector ${is_active ? 'activated' : 'deactivated'} successfully`, { sector }));
});

/** DELETE /api/v1/sectors/:id - Hard delete */
exports.deleteSector = asyncHandler(async (req, res) => {
    await sectorService.deleteSector(req.params.id);
    res.status(httpStatus.OK).json(new ApiResponse(true, 'Sector deleted successfully'));
});
