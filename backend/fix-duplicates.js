const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixDuplicates() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '3306', 10),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ...(process.env.DB_SSL === 'true' && { ssl: { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true' } }),
    });

    const conn = await pool.getConnection();
    
    // 1. Delete duplicates from sectors
    console.log('Removing duplicate sectors...');
    await conn.query(`
        DELETE t1 FROM sectors t1
        INNER JOIN sectors t2 
        WHERE t1.id > t2.id AND t1.name_en = t2.name_en;
    `);
    console.log('Duplicates removed.');

    // 2. Ensure name_en is unique
    console.log('Ensuring name_en is unique...');
    try {
        await conn.query('ALTER TABLE sectors ADD UNIQUE INDEX unique_name_en (name_en);');
    } catch(e) {
        console.log('Unique constraint might already exist:', e.message);
    }

    conn.release();
    pool.end();
    console.log('Done.');
}
fixDuplicates();
