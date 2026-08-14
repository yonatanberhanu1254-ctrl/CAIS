const db = require('../config/db');

class DashboardModel {

    static async getSectorStatistics(executor = db) {
        try {
            const [rows] = await executor.execute(`
                SELECT 
                    COUNT(id) AS totalSectors,
                    SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS activeSectors,
                    SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) AS inactiveSectors,
                    MAX(updated_at) AS latestSectorUpdate
                FROM sectors
            `);
            return rows[0] || { totalSectors: 0, activeSectors: 0, inactiveSectors: 0, latestSectorUpdate: null };
        } catch { return { totalSectors: 0, activeSectors: 0, inactiveSectors: 0, latestSectorUpdate: null }; }
    }

    static async getMessageStatistics(executor = db) {
        try {
            const [rows] = await executor.execute(`
                SELECT 
                    COUNT(id) AS totalMessages,
                    SUM(CASE WHEN status = 'Unread' THEN 1 ELSE 0 END) AS unreadMessages,
                    SUM(CASE WHEN status = 'Read' THEN 1 ELSE 0 END) AS readMessages,
                    SUM(CASE WHEN status = 'Archived' THEN 1 ELSE 0 END) AS archivedMessages,
                    MAX(submitted_at) AS latestMessage
                FROM contact_messages
            `);
            return rows[0] || { totalMessages: 0, unreadMessages: 0, readMessages: 0, archivedMessages: 0, latestMessage: null };
        } catch { return { totalMessages: 0, unreadMessages: 0, readMessages: 0, archivedMessages: 0, latestMessage: null }; }
    }

    static async getAuditLogStatistics(executor = db) {
        try {
            const [rows] = await executor.execute(`
                SELECT 
                    COUNT(id) AS totalAuditLogs,
                    SUM(CASE WHEN action = 'LOGIN' THEN 1 ELSE 0 END) AS totalLogins,
                    SUM(CASE WHEN status = 'FAILURE' THEN 1 ELSE 0 END) AS failedActions,
                    MAX(created_at) AS latestActivity
                FROM audit_logs
            `);
            return rows[0] || { totalAuditLogs: 0, totalLogins: 0, failedActions: 0, latestActivity: null };
        } catch { return { totalAuditLogs: 0, totalLogins: 0, failedActions: 0, latestActivity: null }; }
    }

    static async getLatestLogin(executor = db) {
        try {
            const [rows] = await executor.execute(`
                SELECT a.email, a.full_name, a.role, a.last_login_at
                FROM admins a
                WHERE a.last_login_at IS NOT NULL
                ORDER BY a.last_login_at DESC
                LIMIT 1
            `);
            return rows[0] || null;
        } catch { return null; }
    }

    static async getRecentMessages(limit = 10, executor = db) {
        try {
            const [rows] = await executor.execute(
                'SELECT id, full_name, subject, status, submitted_at FROM contact_messages ORDER BY submitted_at DESC LIMIT ?',
                [limit]
            );
            return rows || [];
        } catch { return []; }
    }

    static async getRecentSectorUpdates(limit = 10, executor = db) {
        try {
            const [rows] = await executor.execute(
                'SELECT id, name_en, is_active, updated_at, updated_by FROM sectors ORDER BY updated_at DESC LIMIT ?',
                [limit]
            );
            return rows || [];
        } catch { return []; }
    }

    static async getRecentAuditLogs(limit = 10, executor = db) {
        try {
            const [rows] = await executor.execute(`
                SELECT al.id, al.action, al.entity_type, al.entity_id, al.description, al.status,
                       al.created_at, a.email AS admin_email, a.full_name AS admin_name
                FROM audit_logs al
                LEFT JOIN admins a ON al.admin_id = a.id
                ORDER BY al.created_at DESC
                LIMIT ?
            `, [limit]);
            return rows || [];
        } catch { return []; }
    }

    static async getMonthlyMessageStats(executor = db) {
        try {
            const [rows] = await executor.execute(`
                SELECT 
                    DATE_FORMAT(submitted_at, '%Y-%m') AS month,
                    DATE_FORMAT(submitted_at, '%b %Y') AS label,
                    COUNT(*) AS total,
                    SUM(CASE WHEN status = 'Unread' THEN 1 ELSE 0 END) AS unread,
                    SUM(CASE WHEN status = 'Read' THEN 1 ELSE 0 END) AS \`read\`
                FROM contact_messages
                WHERE submitted_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
                GROUP BY DATE_FORMAT(submitted_at, '%Y-%m'), DATE_FORMAT(submitted_at, '%b %Y')
                ORDER BY month ASC
            `);
            return rows || [];
        } catch { return []; }
    }

    static async getMonthlyAuditStats(executor = db) {
        try {
            const [rows] = await executor.execute(`
                SELECT 
                    DATE_FORMAT(created_at, '%Y-%m') AS month,
                    DATE_FORMAT(created_at, '%b %Y') AS label,
                    COUNT(*) AS total,
                    SUM(CASE WHEN status = 'SUCCESS' THEN 1 ELSE 0 END) AS success,
                    SUM(CASE WHEN status = 'FAILURE' THEN 1 ELSE 0 END) AS failure
                FROM audit_logs
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
                GROUP BY DATE_FORMAT(created_at, '%Y-%m'), DATE_FORMAT(created_at, '%b %Y')
                ORDER BY month ASC
            `);
            return rows || [];
        } catch { return []; }
    }

    static async getMonthlySectorStats(executor = db) {
        try {
            const [rows] = await executor.execute(`
                SELECT 
                    DATE_FORMAT(updated_at, '%Y-%m') AS month,
                    DATE_FORMAT(updated_at, '%b %Y') AS label,
                    COUNT(*) AS total
                FROM sectors
                WHERE updated_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
                GROUP BY DATE_FORMAT(updated_at, '%Y-%m'), DATE_FORMAT(updated_at, '%b %Y')
                ORDER BY month ASC
            `);
            return rows || [];
        } catch { return []; }
    }

    static async getSystemHealth(executor = db) {
        try {
            await executor.execute('SELECT 1');
            return { databaseStatus: 'Online', connectionPoolStatus: 'Healthy' };
        } catch {
            return { databaseStatus: 'Offline', connectionPoolStatus: 'Error' };
        }
    }

    static async getDashboardSummary(executor = db) {
        const [sectorStats, messageStats, auditStats, latestLogin] = await Promise.all([
            this.getSectorStatistics(executor),
            this.getMessageStatistics(executor),
            this.getAuditLogStatistics(executor),
            this.getLatestLogin(executor)
        ]);
        return {
            totalSectors: Number(sectorStats.totalSectors || 0),
            activeSectors: Number(sectorStats.activeSectors || 0),
            inactiveSectors: Number(sectorStats.inactiveSectors || 0),
            latestSectorUpdate: sectorStats.latestSectorUpdate || null,
            totalContactMessages: Number(messageStats.totalMessages || 0),
            unreadMessages: Number(messageStats.unreadMessages || 0),
            readMessages: Number(messageStats.readMessages || 0),
            archivedMessages: Number(messageStats.archivedMessages || 0),
            latestMessage: messageStats.latestMessage || null,
            totalAuditLogs: Number(auditStats.totalAuditLogs || 0),
            latestActivity: auditStats.latestActivity || null,
            latestLogin: latestLogin || null,
        };
    }
}

module.exports = DashboardModel;
