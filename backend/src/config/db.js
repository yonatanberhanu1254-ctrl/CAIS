/**
 * MySQL2 Database Connection Pool
 * Replaces the previous in-memory MockDB simulator.
 * Connection details are driven by environment variables in .env
 */
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');

// Auto-create upload directories on startup
const uploadDirs = [
    path.join(__dirname, '../uploads'),
    path.join(__dirname, '../uploads/city'),
    path.join(__dirname, '../uploads/sectors'),
];
uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

const pool = mysql.createPool({
    host:               process.env.DB_HOST     || 'localhost',
    port:               parseInt(process.env.DB_PORT || '3306', 10),
    user:               process.env.DB_USER     || 'cais_user',
    password:           process.env.DB_PASSWORD || 'secret_password_here',
    database:           process.env.DB_NAME     || 'cais_db',
    waitForConnections: true,
    connectionLimit:    10,
    queueLimit:         0,
    timezone:           '+00:00',
    charset:            'utf8mb4',
    decimalNumbers:     true,
});

/**
 * Tests the database connection and exits gracefully if unavailable.
 * Provides structured JSON error messages instead of generic unhandled exceptions.
 */
pool.testConnection = async () => {
    try {
        const conn = await pool.getConnection();
        console.log(JSON.stringify({
            success: true,
            message: 'Database connected successfully.',
            host: process.env.DB_HOST,
            database: process.env.DB_NAME
        }, null, 2));

        // --- Auto-Migration to align schema with models ---
        try {
            await conn.query('RENAME TABLE users TO admins');
        } catch(e) {}
        try { await conn.query('ALTER TABLE admins ADD COLUMN last_login_at TIMESTAMP NULL'); } catch(e) {}
        try { await conn.query('ALTER TABLE admins ADD COLUMN profile_image_url VARCHAR(500) NULL'); } catch(e) {}
        try { await conn.query('ALTER TABLE sectors ADD COLUMN short_description VARCHAR(255) NULL'); } catch(e) {}
        try { await conn.query('ALTER TABLE sectors ADD COLUMN google_maps_url VARCHAR(500) NULL'); } catch(e) {}
        try { await conn.query('ALTER TABLE sectors ADD COLUMN office_hours VARCHAR(255) NULL'); } catch(e) {}
        try { await conn.query("ALTER TABLE contact_messages MODIFY COLUMN status ENUM('Unread', 'Read', 'Archived') DEFAULT 'Unread'"); } catch(e) {}
        try { await conn.query('ALTER TABLE audit_logs CHANGE user_id admin_id INT'); } catch(e) {}
        try { await conn.query('ALTER TABLE audit_logs CHANGE details description TEXT'); } catch(e) {}
        try { await conn.query('ALTER TABLE audit_logs ADD COLUMN user_agent TEXT NULL'); } catch(e) {}
        try { await conn.query('ALTER TABLE audit_logs ADD COLUMN request_id VARCHAR(100) NULL'); } catch(e) {}
        try { await conn.query('ALTER TABLE audit_logs ADD COLUMN status VARCHAR(50) DEFAULT "SUCCESS"'); } catch(e) {}
        try { await conn.query('ALTER TABLE contact_messages CHANGE created_at submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP'); } catch(e) {}

        conn.release();
    } catch (err) {
        let structuredError = {
            success: false,
            message: "Database error.",
            reason: err.message,
            code: "DB_ERROR"
        };

        if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            structuredError = {
                success: false,
                message: "Database authentication failed.",
                reason: `Invalid MySQL username ('${process.env.DB_USER}') or password.`,
                code: "DB_AUTH_ERROR"
            };
        } else if (err.code === 'ECONNREFUSED') {
            structuredError = {
                success: false,
                message: "Database connection failed.",
                reason: `MySQL server is not running or unreachable on ${process.env.DB_HOST}:${process.env.DB_PORT}.`,
                code: "DB_CONN_ERROR"
            };
        } else if (err.code === 'ER_BAD_DB_ERROR') {
            structuredError = {
                success: false,
                message: "Database not found.",
                reason: `The configured database ('${process.env.DB_NAME}') does not exist.`,
                code: "DB_NOT_FOUND"
            };
        }

        console.error(JSON.stringify(structuredError, null, 2));
        console.error('\n   Action Required: Please check your MySQL configuration or run the setup_user.sql script.');
        
        // Exit gracefully so we don't start the Express server
        process.exit(1);
    }
};

module.exports = pool;
