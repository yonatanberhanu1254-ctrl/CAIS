-- ============================================================
-- CAIS - Database User & Privileges Setup
-- ============================================================

-- 1. Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS cais_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Create the user if it doesn't exist (using the password from .env)
CREATE USER IF NOT EXISTS 'cais_user'@'localhost' IDENTIFIED BY 'secret_password_here';

-- If the user already exists but has the wrong password, you can update it with:
-- ALTER USER 'cais_user'@'localhost' IDENTIFIED BY 'secret_password_here';

-- 3. Grant privileges required for all CRUD operations
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, DROP, REFERENCES ON cais_db.* TO 'cais_user'@'localhost';

-- 4. Apply privileges
FLUSH PRIVILEGES;
