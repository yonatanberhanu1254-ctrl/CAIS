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
            multipleStatements: true,
            ...(process.env.DB_SSL === 'true' && { ssl: { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true' } }),
        });

        const conn = await pool.getConnection();
        console.log('Successfully connected to database:', process.env.DB_NAME);

        // Check if the database is already properly initialized
        // by checking if the sectors table has the name_en column (multilingual schema)
        const [columns] = await conn.query(
            `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
             WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'sectors' AND COLUMN_NAME = 'name_en'`,
            [process.env.DB_NAME]
        );

        // Also check if there is actual seed data
        let hasSeedData = false;
        try {
            const [rows] = await conn.query('SELECT COUNT(*) as cnt FROM sectors');
            hasSeedData = rows[0].cnt > 0;
        } catch (e) {
            // Table may not exist yet
        }

        if (columns.length > 0 && hasSeedData) {
            console.log('Database already initialized with correct schema and seed data. Forcing a rebuild to clear duplicates...');
            // conn.release();
            // await pool.end();
            // process.exit(0);
        }

        console.log('Database needs initialization. Dropping existing tables and recreating...');

        // Drop all tables in correct order (respecting foreign keys)
        await conn.query('SET FOREIGN_KEY_CHECKS = 0');
        await conn.query('DROP TABLE IF EXISTS audit_logs');
        await conn.query('DROP TABLE IF EXISTS contact_messages');
        await conn.query('DROP TABLE IF EXISTS sectors');
        await conn.query('DROP TABLE IF EXISTS city_information');
        await conn.query('DROP TABLE IF EXISTS admins');
        await conn.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('Old tables dropped successfully.');

        // Read and execute schema.sql (which has the correct multilingual structure)
        console.log('Reading database/schema.sql...');
        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        let schemaSql = fs.readFileSync(schemaPath, 'utf8');
        
        // Remove CREATE DATABASE and USE statements for cloud environments
        schemaSql = schemaSql.replace(/CREATE DATABASE IF NOT EXISTS cais_db[^;]*;/gi, '');
        schemaSql = schemaSql.replace(/USE cais_db;/gi, '');

        console.log('Executing schema.sql to create tables and seed data...');
        await conn.query(schemaSql);
        console.log('Schema and seed data executed successfully!');

        // Verify the data was inserted
        const [sectorCount] = await conn.query('SELECT COUNT(*) as cnt FROM sectors');
        const [adminCount] = await conn.query('SELECT COUNT(*) as cnt FROM admins');
        const [cityCount] = await conn.query('SELECT COUNT(*) as cnt FROM city_information');
        console.log(`Verification: ${adminCount[0].cnt} admins, ${sectorCount[0].cnt} sectors, ${cityCount[0].cnt} city info records.`);

        conn.release();
        await pool.end();
        console.log('Cloud database initialization complete! You can now log in.');
        process.exit(0);
    } catch (err) {
        console.error('Failed to initialize database:', err.message);
        // Don't crash the server — let it start even if DB init fails
        process.exit(0);
    }
}

initCloudDB();
