const db = require('../config/db');

class AuditLogModel {
    // Explicit columns to prevent SELECT * and control memory utilization
    static BASE_COLUMNS = `id, admin_id, action, entity_type, entity_id, description, ip_address, user_agent, request_id, status, created_at`;
    
    // LIST_COLUMNS trims heavy fields for paginated results (e.g. user_agent)
    static LIST_COLUMNS = `id, admin_id, action, entity_type, entity_id, description, status, created_at`;

    /**
     * Efficiently checks if an audit log exists by ID.
     * @param {number} id 
     * @param {Object} [executor=db] 
     * @returns {Promise<boolean>}
     */
    static async exists(id, executor = db) {
        const [rows] = await executor.execute('SELECT 1 FROM audit_logs WHERE id = ?', [id]);
        return rows.length > 0;
    }

    /**
     * Retrieves a complete audit log by ID.
     * @param {number} id 
     * @param {Object} [executor=db] 
     * @returns {Promise<Object|null>}
     */
    static async findById(id, executor = db) {
        const sql = `SELECT ${this.BASE_COLUMNS} FROM audit_logs WHERE id = ?`;
        const [rows] = await executor.execute(sql, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    /**
     * Retrieves a paginated, filtered, and sorted list of audit logs.
     * Optimized using dynamic parameterized SQL without concatenation vulnerabilities.
     * @param {Object} filters 
     * @param {Object} [executor=db] 
     * @returns {Promise<{rows: Array, total: number}>}
     */
    static async findAll(filters, executor = db) {
        let sql = `SELECT ${this.LIST_COLUMNS} FROM audit_logs WHERE 1=1`;
        let countSql = `SELECT COUNT(id) as total FROM audit_logs WHERE 1=1`;
        const params = [];

        if (filters.search) {
            sql += ` AND (action LIKE ? OR description LIKE ? OR entity_type LIKE ?)`;
            countSql += ` AND (action LIKE ? OR description LIKE ? OR entity_type LIKE ?)`;
            const searchPattern = `%${filters.search}%`;
            params.push(searchPattern, searchPattern, searchPattern);
        }

        if (filters.action) {
            sql += ` AND action = ?`;
            countSql += ` AND action = ?`;
            params.push(filters.action);
        }

        if (filters.entityType) {
            sql += ` AND entity_type = ?`;
            countSql += ` AND entity_type = ?`;
            params.push(filters.entityType);
        }

        if (filters.adminId) {
            sql += ` AND admin_id = ?`;
            countSql += ` AND admin_id = ?`;
            params.push(filters.adminId);
        }

        if (filters.status) {
            sql += ` AND status = ?`;
            countSql += ` AND status = ?`;
            params.push(filters.status);
        }

        if (filters.dateFrom) {
            sql += ` AND created_at >= ?`;
            countSql += ` AND created_at >= ?`;
            params.push(filters.dateFrom);
        }

        if (filters.dateTo) {
            sql += ` AND created_at <= ?`;
            countSql += ` AND created_at <= ?`;
            params.push(filters.dateTo);
        }

        // Defense-in-depth: Model-level whitelist for sort interpolation
        const allowedSortColumns = ['created_at', 'action', 'entity_type', 'admin_id'];
        const safeSort = allowedSortColumns.includes(filters.sort) ? filters.sort : 'created_at';
        const safeOrder = (filters.order && filters.order.toUpperCase() === 'ASC') ? 'ASC' : 'DESC';

        sql += ` ORDER BY ${safeSort} ${safeOrder} LIMIT ? OFFSET ?`;

        const queryParams = [...params, Number(filters.limit || 10), Number(filters.offset || 0)];

        // Concurrent execution halves database latency
        const [ [rows], [countRows] ] = await Promise.all([
            executor.execute(sql, queryParams),
            executor.execute(countSql, params)
        ]);

        return { rows, total: countRows[0] ? countRows[0].total : 0 };
    }

    /**
     * Creates a new immutable audit log record.
     * @param {Object} data 
     * @param {Object} [executor=db] 
     * @returns {Promise<number>} Inserted ID
     */
    static async create(data, executor = db) {
        const sql = `
            INSERT INTO audit_logs 
            (admin_id, action, entity_type, entity_id, description, ip_address, user_agent, request_id, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
            data.admin_id,
            data.action,
            data.entity_type || null,
            data.entity_id || null,
            data.description || null,
            data.ip_address || null,
            data.user_agent || null,
            data.request_id || null,
            data.status || 'SUCCESS'
        ];

        const [result] = await executor.execute(sql, params);
        return result.insertId;
    }

    /**
     * Permanently deletes an audit log.
     * Only accessible to SuperAdmin.
     * @param {number} id 
     * @param {Object} [executor=db] 
     * @returns {Promise<boolean>}
     */
    static async delete(id, executor = db) {
        const [result] = await executor.execute('DELETE FROM audit_logs WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = AuditLogModel;
