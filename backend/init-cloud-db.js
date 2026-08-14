const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function initCloudDB() {
    console.log('Connecting to Cloud Database...');
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '3306', 10),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            multipleStatements: true, // Required to run multiple SQL statements at once
            ...(process.env.DB_SSL === 'true' && { ssl: { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true' } }),
        });

        const conn = await pool.getConnection();
        console.log('Successfully connected to database:', process.env.DB_NAME);

        // 1. Read and execute schema.sql
        console.log('Reading database/schema.sql...');
        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        
        console.log('Executing schema.sql to create tables...');
        await conn.query(schemaSql);
        console.log('Tables created successfully!');

        conn.release();
        console.log('Cloud database initialization complete! You can now log in.');
        process.exit(0);
    } catch (err) {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    }
}

initCloudDB();
