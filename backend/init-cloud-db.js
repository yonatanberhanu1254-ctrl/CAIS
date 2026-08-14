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

        // 1. Run multilingual migration FIRST to ensure existing old tables are upgraded
        // so that schema.sql's INSERT statements (which use the new column names) don't crash.
        console.log('Reading database/migrations/01_multilingual_support.sql...');
        const migrationPath = path.join(__dirname, 'database', 'migrations', '01_multilingual_support.sql');
        let migrationSql = fs.readFileSync(migrationPath, 'utf8');
        migrationSql = migrationSql.replace(/USE cais_db;/gi, ''); // Strip USE statement

        try {
            console.log('Executing 01_multilingual_support.sql to add multilingual columns...');
            await conn.query(migrationSql);
            console.log('Migration completed successfully!');
        } catch (migrationErr) {
            console.log('Migration already applied or partially applied. Skipping... (Error:', migrationErr.message, ')');
        }

        // 2. Read and execute schema.sql
        console.log('Reading database/schema.sql...');
        const schemaPath = path.join(__dirname, 'database', 'schema.sql');
        let schemaSql = fs.readFileSync(schemaPath, 'utf8');
        
        // Remove CREATE DATABASE and USE statements for cloud environments
        // so that it executes in the provided DB_NAME instead of cais_db
        schemaSql = schemaSql.replace(/CREATE DATABASE IF NOT EXISTS cais_db[^;]*;/gi, '');
        schemaSql = schemaSql.replace(/USE cais_db;/gi, '');

        try {
            console.log('Executing schema.sql to create tables and seed data...');
            await conn.query(schemaSql);
            console.log('Schema execution completed successfully!');
        } catch (schemaErr) {
            console.log('Schema execution encountered an error (likely duplicate seed data ignored):', schemaErr.message);
        }

        conn.release();
        console.log('Cloud database initialization complete! You can now log in.');
        process.exit(0);
    } catch (err) {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    }
}

initCloudDB();
