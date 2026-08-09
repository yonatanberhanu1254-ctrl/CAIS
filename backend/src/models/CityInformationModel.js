const db = require('../config/db');

class CityInformationModel {
    static BASE_COLUMNS = `id, city_name_en, city_name_am, city_name_om, mayor_name, mayor_message_en, mayor_message_am, mayor_message_om, mayor_image_url, about_city_en, about_city_am, about_city_om, vision_en, vision_am, vision_om, mission_en, mission_am, mission_om, history_en, history_am, history_om, welcome_message_en, welcome_message_am, welcome_message_om, address_en, address_am, address_om, email, phone, office_hours, facebook_url, telegram_url, website_url, latitude, longitude, logo_url, banner_url, updated_by, created_at, updated_at`;

    static async exists(executor = db) {
        const [rows] = await executor.execute('SELECT 1 FROM city_information LIMIT 1');
        return rows.length > 0;
    }

    static async find(executor = db) {
        const sql = `SELECT ${this.BASE_COLUMNS} FROM city_information LIMIT 1`;
        const [rows] = await executor.execute(sql);
        return rows.length > 0 ? rows[0] : null;
    }

    static async create(data, executor = db) {
        const sql = `
            INSERT INTO city_information 
            (city_name_en, city_name_am, city_name_om, mayor_name, mayor_message_en, mayor_message_am, mayor_message_om, welcome_message_en, welcome_message_am, welcome_message_om, about_city_en, about_city_am, about_city_om, vision_en, vision_am, vision_om, mission_en, mission_am, mission_om, history_en, history_am, history_om, address_en, address_am, address_om, email, phone, office_hours, facebook_url, telegram_url, website_url, latitude, longitude, updated_by) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [
            data.city_name_en, data.city_name_am || null, data.city_name_om || null,
            data.mayor_name || null,
            data.mayor_message_en || null, data.mayor_message_am || null, data.mayor_message_om || null,
            data.welcome_message_en || null, data.welcome_message_am || null, data.welcome_message_om || null,
            data.about_city_en || null, data.about_city_am || null, data.about_city_om || null,
            data.vision_en || null, data.vision_am || null, data.vision_om || null,
            data.mission_en || null, data.mission_am || null, data.mission_om || null,
            data.history_en || null, data.history_am || null, data.history_om || null,
            data.address_en || null, data.address_am || null, data.address_om || null,
            data.email || null, data.phone || null, data.office_hours || null,
            data.facebook_url || null, data.telegram_url || null, data.website_url || null,
            data.latitude || null, data.longitude || null, data.updated_by
        ];
        const [result] = await executor.execute(sql, params);
        return result.insertId;
    }

    static async update(data, executor = db) {
        const fields = [];
        const params = [];
        const allowedFields = [
            'city_name_en', 'city_name_am', 'city_name_om', 'mayor_name', 
            'mayor_message_en', 'mayor_message_am', 'mayor_message_om', 
            'welcome_message_en', 'welcome_message_am', 'welcome_message_om',
            'about_city_en', 'about_city_am', 'about_city_om', 
            'vision_en', 'vision_am', 'vision_om',
            'mission_en', 'mission_am', 'mission_om', 
            'history_en', 'history_am', 'history_om', 
            'address_en', 'address_am', 'address_om', 
            'email', 'phone', 'office_hours',
            'facebook_url', 'telegram_url', 'website_url', 'latitude', 'longitude', 'updated_by'
        ];
        for (const [key, value] of Object.entries(data)) {
            if (allowedFields.includes(key)) {
                fields.push(`${key} = ?`);
                params.push(value);
            }
        }
        if (fields.length === 0) return true;
        const sql = `UPDATE city_information SET ${fields.join(', ')}`;
        const [result] = await executor.execute(sql, params);
        return result.affectedRows > 0;
    }

    static async updateLogo(logoUrl, updatedBy, executor = db) {
        const [result] = await executor.execute('UPDATE city_information SET logo_url = ?, updated_by = ?', [logoUrl, updatedBy]);
        return result.affectedRows > 0;
    }

    static async updateBanner(bannerUrl, updatedBy, executor = db) {
        const [result] = await executor.execute('UPDATE city_information SET banner_url = ?, updated_by = ?', [bannerUrl, updatedBy]);
        return result.affectedRows > 0;
    }

    static async updateMayorImage(mayorImageUrl, updatedBy, executor = db) {
        const [result] = await executor.execute('UPDATE city_information SET mayor_image_url = ?, updated_by = ?', [mayorImageUrl, updatedBy]);
        return result.affectedRows > 0;
    }
}

module.exports = CityInformationModel;
