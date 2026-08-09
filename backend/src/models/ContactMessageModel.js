const db = require('../config/db');

class ContactMessageModel {
    // Explicit columns to prevent SELECT * and optimize memory usage
    static BASE_COLUMNS = `id, full_name, email, phone, subject, message, status, ip_address, user_agent, submitted_at, updated_at, updated_by`;
    
    // LIST_COLUMNS intentionally excludes the heavy 'message' text payload for list views
    static LIST_COLUMNS = `id, full_name, email, subject, status, submitted_at`;

    /**
     * Efficiently checks if a message exists by ID.
     * @param {number} id 
     * @param {Object} [executor=db] 
     * @returns {Promise<boolean>}
     */
    static async exists(id, executor = db) {
        const [rows] = await executor.execute('SELECT 1 FROM contact_messages WHERE id = ?', [id]);
        return rows.length > 0;
    }

    /**
     * Retrieves a complete message by ID.
     * @param {number} id 
     * @param {Object} [executor=db] 
     * @returns {Promise<Object|null>}
     */
    static async findById(id, executor = db) {
        const sql = `SELECT ${this.BASE_COLUMNS} FROM contact_messages WHERE id = ?`;
        const [rows] = await executor.execute(sql, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    /**
     * Retrieves a paginated, filtered, and sorted list of messages.
     * @param {Object} options 
     * @param {Object} [executor=db] 
     * @returns {Promise<{rows: Array, total: number}>}
     */
    static async findAll({ search, status, sort, order, limit, offset }, executor = db) {
        let sql = `SELECT ${this.LIST_COLUMNS} FROM contact_messages WHERE 1=1`;
        let countSql = `SELECT COUNT(id) as total FROM contact_messages WHERE 1=1`;
        const params = [];

        if (status) {
            sql += ' AND status = ?';
            countSql += ' AND status = ?';
            params.push(status);
        }

        if (search) {
            // Searches across multiple fields, useful for broad admin queries
            sql += ' AND (full_name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)';
            countSql += ' AND (full_name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)';
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern, searchPattern, searchPattern);
        }

        // Defense-in-depth: Model-level whitelist for interpolation
        const allowedSortColumns = ['submitted_at', 'full_name', 'status', 'email'];
        const safeSort = allowedSortColumns.includes(sort) ? sort : 'submitted_at';
        const safeOrder = (order && order.toUpperCase() === 'ASC') ? 'ASC' : 'DESC';

        sql += ` ORDER BY ${safeSort} ${safeOrder} LIMIT ? OFFSET ?`;
        
        const queryParams = [...params, Number(limit), Number(offset)];

        // Concurrent execution for pagination efficiency
        // Use query() instead of execute() because mysql2's prepared statements
        // cannot handle numeric LIMIT/OFFSET params — they require string types.
        const [ [rows], [countRows] ] = await Promise.all([
            executor.query(sql, queryParams),
            executor.query(countSql, params)
        ]);

        return { rows, total: countRows[0] ? countRows[0].total : 0 };
    }

    /**
     * Creates a new contact message.
     * Defaults status to 'Unread' automatically via DB schema, but we don't insert it.
     * @param {Object} data 
     * @param {Object} [executor=db] 
     * @returns {Promise<number>}
     */
    static async create(data, executor = db) {
        const sql = `
            INSERT INTO contact_messages 
            (full_name, email, phone, subject, message, ip_address, user_agent) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
            data.full_name,
            data.email,
            data.phone || null,
            data.subject,
            data.message,
            data.ip_address || null,
            data.user_agent || null
        ];

        const [result] = await executor.execute(sql, params);
        return result.insertId;
    }

    /**
     * Updates the status of a message.
     * @param {number} id 
     * @param {string} status ('Read' or 'Unread')
     * @param {number} updatedBy 
     * @param {Object} [executor=db] 
     * @returns {Promise<boolean>}
     */
    static async updateStatus(id, status, updatedBy, executor = db) {
        const sql = 'UPDATE contact_messages SET status = ?, updated_by = ? WHERE id = ?';
        const [result] = await executor.execute(sql, [status, updatedBy, id]);
        return result.affectedRows > 0;
    }

    /**
     * Permanently deletes a message.
     * @param {number} id 
     * @param {Object} [executor=db] 
     * @returns {Promise<boolean>}
     */
    static async delete(id, executor = db) {
        const [result] = await executor.execute('DELETE FROM contact_messages WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = ContactMessageModel;
