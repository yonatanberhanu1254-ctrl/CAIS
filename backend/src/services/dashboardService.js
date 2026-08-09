const DashboardModel = require('../models/DashboardModel');
const ApiError = require('../utils/ApiError');
const httpStatus = require('../constants/httpStatus');

class DashboardService {
    static async getCompleteDashboard() {
        try {
            const results = await Promise.allSettled([
                DashboardModel.getDashboardSummary(),
                DashboardModel.getRecentMessages(10),
                DashboardModel.getRecentSectorUpdates(10),
                this.getSystemHealth()
            ]);
            return {
                statistics: results[0].status === 'fulfilled' ? results[0].value : {},
                recentMessages: results[1].status === 'fulfilled' ? results[1].value : [],
                recentSectorUpdates: results[2].status === 'fulfilled' ? results[2].value : [],
                systemHealth: results[3].status === 'fulfilled' ? results[3].value : {}
            };
        } catch (error) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to retrieve dashboard metrics.', 'DASHBOARD_RETRIEVAL_FAILED');
        }
    }

    static async getStatistics() {
        try { return await DashboardModel.getDashboardSummary(); }
        catch { throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to retrieve statistics.', 'STATISTICS_RETRIEVAL_FAILED'); }
    }

    static async getRecentMessages() {
        try { return await DashboardModel.getRecentMessages(10); }
        catch { throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to retrieve recent messages.', 'RECENT_MESSAGES_FAILED'); }
    }

    static async getRecentSectorUpdates() {
        try { return await DashboardModel.getRecentSectorUpdates(10); }
        catch { throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to retrieve recent sector updates.', 'RECENT_SECTORS_FAILED'); }
    }

    static async getRecentActivities() {
        try {
            const [messages, auditLogs, sectorUpdates, latestLogin] = await Promise.all([
                DashboardModel.getRecentMessages(10),
                DashboardModel.getRecentAuditLogs(10),
                DashboardModel.getRecentSectorUpdates(10),
                DashboardModel.getLatestLogin()
            ]);
            return { messages, auditLogs, sectorUpdates, latestLogin };
        } catch {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to retrieve recent activities.', 'RECENT_ACTIVITIES_FAILED');
        }
    }

    static async getMonthlyCharts() {
        try {
            const [messages, audit, sectors] = await Promise.all([
                DashboardModel.getMonthlyMessageStats(),
                DashboardModel.getMonthlyAuditStats(),
                DashboardModel.getMonthlySectorStats()
            ]);
            return { monthlyMessages: messages, monthlyAudit: audit, monthlySectors: sectors };
        } catch {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to retrieve chart data.', 'CHART_DATA_FAILED');
        }
    }

    static async getSystemHealth(requestId = null) {
        try {
            const dbHealth = await DashboardModel.getSystemHealth();
            return {
                databaseStatus: dbHealth.databaseStatus,
                connectionPoolStatus: dbHealth.connectionPoolStatus,
                serverUptime: process.uptime(),
                currentTimestamp: new Date().toISOString(),
                environment: process.env.NODE_ENV || 'development',
                applicationVersion: process.env.npm_package_version || '1.0.0',
                requestId
            };
        } catch {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to verify system health.', 'SYSTEM_HEALTH_FAILED');
        }
    }
}

module.exports = DashboardService;
