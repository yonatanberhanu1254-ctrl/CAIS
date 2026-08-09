const db = require('../config/db');

class SectorModel {
    static BASE_COLUMNS = `id, name_en, name_am, name_om, short_description_en, short_description_am, short_description_om, description_en, description_am, description_om, services_en, services_am, services_om, mission_en, mission_am, mission_om, vision_en, vision_am, vision_om, office_location_en, office_location_am, office_location_om, email, phone, office_hours, latitude, longitude, google_maps_url, image_url, is_active, updated_by, created_at, updated_at`;
    
    static LIST_COLUMNS = `id, name_en, name_am, name_om, short_description_en, short_description_am, short_description_om, email, phone, office_location_en, office_location_am, office_location_om, image_url, is_active, created_at, updated_at`;

    static async exists(id, executor = db) {
        const [rows] = await executor.execute('SELECT 1 FROM sectors WHERE id = ?', [id]);
        return rows.length > 0;
    }

    static async existsByName(name_en, excludeId = null, executor = db) {
        let sql = 'SELECT 1 FROM sectors WHERE name_en = ?';
        const params = [name_en];

        if (excludeId) {
            sql += ' AND id != ?';
            params.push(excludeId);
        }

        const [rows] = await executor.execute(sql, params);
        return rows.length > 0;
    }

    static async findByName(name_en, excludeId = null, executor = db) {
        let sql = 'SELECT id, name_en FROM sectors WHERE name_en = ?';
        const params = [name_en];

        if (excludeId) {
            sql += ' AND id != ?';
            params.push(excludeId);
        }

        const [rows] = await executor.execute(sql, params);
        return rows.length > 0 ? rows[0] : null;
    }

    static async findById(id, executor = db) {
        const sql = `SELECT ${this.BASE_COLUMNS} FROM sectors WHERE id = ?`;
        const [rows] = await executor.execute(sql, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    static async findAll({ search, sort, order, limit, offset, activeOnly = true, lang = 'en' }, executor = db) {
        let sql = `SELECT ${this.LIST_COLUMNS} FROM sectors WHERE 1=1`;
        let countSql = 'SELECT COUNT(id) as total FROM sectors WHERE 1=1';
        const params = [];

        if (activeOnly) {
            sql += ' AND is_active = TRUE';
            countSql += ' AND is_active = TRUE';
        }

        // Validate language
        const validLang = ['en', 'am', 'om'].includes(lang) ? lang : 'en';

        if (search) {
            const nameCol = `name_${validLang}`;
            const descCol = `description_${validLang}`;
            sql += ` AND (${nameCol} LIKE ? OR ${descCol} LIKE ?)`;
            countSql += ` AND (${nameCol} LIKE ? OR ${descCol} LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }

        let safeSort = 'created_at';
        if (sort === 'name') safeSort = `name_${validLang}`;
        else if (['created_at', 'updated_at'].includes(sort)) safeSort = sort;

        const safeOrder = (order && order.toUpperCase() === 'ASC') ? 'ASC' : 'DESC';

        sql += ` ORDER BY ${safeSort} ${safeOrder} LIMIT ${Number(limit)} OFFSET ${Number(offset)}`;
        
        const [ [rows], [countRows] ] = await Promise.all([
            executor.execute(sql, params),
            executor.execute(countSql, params)
        ]);

        return { rows, total: countRows[0].total };
    }

    static async create(data, executor = db) {
        const sql = `
            INSERT INTO sectors 
            (name_en, name_am, name_om, short_description_en, short_description_am, short_description_om, description_en, description_am, description_om, services_en, services_am, services_om, mission_en, mission_am, mission_om, vision_en, vision_am, vision_om, office_location_en, office_location_am, office_location_om, email, phone, office_hours, latitude, longitude, google_maps_url, is_active, updated_by) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
            data.name_en, data.name_am || null, data.name_om || null,
            data.short_description_en || null, data.short_description_am || null, data.short_description_om || null,
            data.description_en, data.description_am || null, data.description_om || null,
            data.services_en || null, data.services_am || null, data.services_om || null,
            data.mission_en || null, data.mission_am || null, data.mission_om || null,
            data.vision_en || null, data.vision_am || null, data.vision_om || null,
            data.office_location_en || null, data.office_location_am || null, data.office_location_om || null,
            data.email || null,
            data.phone || null,
            data.office_hours || null,
            data.latitude || null,
            data.longitude || null,
            data.google_maps_url || null,
            data.is_active !== undefined ? data.is_active : true,
            data.updated_by || null
        ];

        const [result] = await executor.execute(sql, params);
        return result.insertId;
    }

    static async update(id, data, executor = db) {
        const fields = [];
        const params = [];

        const allowedFields = [
            'name_en', 'name_am', 'name_om', 
            'short_description_en', 'short_description_am', 'short_description_om', 
            'description_en', 'description_am', 'description_om', 
            'services_en', 'services_am', 'services_om', 
            'mission_en', 'mission_am', 'mission_om', 
            'vision_en', 'vision_am', 'vision_om', 
            'office_location_en', 'office_location_am', 'office_location_om', 
            'email', 'phone', 'office_hours', 'latitude', 'longitude', 'google_maps_url', 'updated_by'
        ];

        for (const [key, value] of Object.entries(data)) {
            if (allowedFields.includes(key)) {
                fields.push(`${key} = ?`);
                params.push(value);
            }
        }

        if (fields.length === 0) return true;

        const sql = `UPDATE sectors SET ${fields.join(', ')} WHERE id = ?`;
        params.push(id);

        const [result] = await executor.execute(sql, params);
        return result.affectedRows > 0;
    }

    static async updateImage(id, imageUrl, updatedBy, executor = db) {
        const sql = 'UPDATE sectors SET image_url = ?, updated_by = ? WHERE id = ?';
        const [result] = await executor.execute(sql, [imageUrl, updatedBy, id]);
        return result.affectedRows > 0;
    }

    static async updateStatus(id, isActive, updatedBy, executor = db) {
        const sql = 'UPDATE sectors SET is_active = ?, updated_by = ? WHERE id = ?';
        const [result] = await executor.execute(sql, [isActive, updatedBy, id]);
        return result.affectedRows > 0;
    }

    static async delete(id, executor = db) {
        const [result] = await executor.execute('DELETE FROM sectors WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = SectorModel;
