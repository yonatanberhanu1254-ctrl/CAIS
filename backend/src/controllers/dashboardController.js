const dashboardService = require('../services/dashboardService');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const httpStatus = require('../constants/httpStatus');

exports.getDashboard = asyncHandler(async (req, res) => {
    const data = await dashboardService.getCompleteDashboard();
    res.status(httpStatus.OK).json(new ApiResponse(true, 'Dashboard retrieved successfully', data));
});

exports.getStatistics = asyncHandler(async (req, res) => {
    const statistics = await dashboardService.getStatistics();
    res.status(httpStatus.OK).json(new ApiResponse(true, 'Statistics retrieved successfully', { statistics }));
});

exports.getRecentMessages = asyncHandler(async (req, res) => {
    const recentMessages = await dashboardService.getRecentMessages();
    res.status(httpStatus.OK).json(new ApiResponse(true, 'Recent messages retrieved successfully', { recentMessages }));
});

exports.getRecentSectorUpdates = asyncHandler(async (req, res) => {
    const recentSectorUpdates = await dashboardService.getRecentSectorUpdates();
    res.status(httpStatus.OK).json(new ApiResponse(true, 'Recent sector updates retrieved successfully', { recentSectorUpdates }));
});

exports.getRecentActivities = asyncHandler(async (req, res) => {
    const activities = await dashboardService.getRecentActivities();
    res.status(httpStatus.OK).json(new ApiResponse(true, 'Recent activities retrieved successfully', activities));
});

exports.getMonthlyCharts = asyncHandler(async (req, res) => {
    const charts = await dashboardService.getMonthlyCharts();
    res.status(httpStatus.OK).json(new ApiResponse(true, 'Chart data retrieved successfully', charts));
});

exports.getSystemHealth = asyncHandler(async (req, res) => {
    const systemHealth = await dashboardService.getSystemHealth(req.id);
    res.status(httpStatus.OK).json(new ApiResponse(true, 'System health retrieved successfully', { systemHealth }));
});
