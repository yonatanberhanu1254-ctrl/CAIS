const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixDB() {
    try {
        console.log('Connecting to MySQL...');
        const pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '3306', 10),
            user: process.env.DB_USER || 'cais_user',
            password: process.env.DB_PASSWORD || 'secret_password_here',
            database: process.env.DB_NAME || 'cais_db',
        });
        const conn = await pool.getConnection();

        console.log('Renaming users table to admins...');
        try { await conn.query('RENAME TABLE users TO admins'); } catch(e) {}

        console.log('Adding columns to admins...');
        try { await conn.query('ALTER TABLE admins ADD COLUMN last_login_at TIMESTAMP NULL'); } catch(e) {}
        try { await conn.query('ALTER TABLE admins ADD COLUMN profile_image_url VARCHAR(500) NULL'); } catch(e) {}

        console.log('Adding columns to sectors...');
        try { await conn.query('ALTER TABLE sectors ADD COLUMN short_description VARCHAR(255) NULL'); } catch(e) {}
        try { await conn.query('ALTER TABLE sectors ADD COLUMN google_maps_url VARCHAR(500) NULL'); } catch(e) {}
        try { await conn.query('ALTER TABLE sectors ADD COLUMN office_hours VARCHAR(255) NULL'); } catch(e) {}

        console.log('Altering contact_messages status ENUM...');
        try { await conn.query("ALTER TABLE contact_messages MODIFY COLUMN status ENUM('Unread', 'Read', 'Archived') DEFAULT 'Unread'"); } catch(e) { console.error(e.message); }

        console.log('Altering audit_logs to match backend...');
        try { await conn.query('ALTER TABLE audit_logs CHANGE user_id admin_id INT'); } catch(e) {}
        try { await conn.query('ALTER TABLE audit_logs CHANGE details description TEXT'); } catch(e) {}
        try { await conn.query('ALTER TABLE audit_logs ADD COLUMN user_agent TEXT NULL'); } catch(e) {}
        try { await conn.query('ALTER TABLE audit_logs ADD COLUMN request_id VARCHAR(100) NULL'); } catch(e) {}
        try { await conn.query('ALTER TABLE audit_logs ADD COLUMN status VARCHAR(50) DEFAULT "SUCCESS"'); } catch(e) {}

        conn.release();
        console.log('Database schema fixed to match models!');
        process.exit(0);
    } catch (err) {
        console.error('Failed to fix database:', err.message);
        process.exit(1);
    }
}

fixDB();
