#!/bin/bash
# =====================================================
# CAIS Database Setup Script
# Run with: sudo bash backend/setup-db.sh
# =====================================================

echo "============================================"
echo "  CAIS Database Setup"
echo "============================================"

DB_NAME="cais_db"
DB_USER="cais_user"
DB_PASS="secret_password_here"

echo "[1/3] Creating database and user..."
mysql -e "
CREATE DATABASE IF NOT EXISTS ${DB_NAME};
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';
GRANT ALL PRIVILEGES ON ${DB_NAME}.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
"

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to create database/user. Are you running with sudo?"
    exit 1
fi

echo "[2/3] Creating tables..."
mysql ${DB_NAME} -e "
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role ENUM('SuperAdmin','DepartmentAdmin','Public') DEFAULT 'Public',
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS city_information (
  id INT AUTO_INCREMENT PRIMARY KEY,
  city_name VARCHAR(255) NOT NULL,
  mayor_name VARCHAR(255),
  mayor_message TEXT,
  about_city TEXT,
  vision TEXT,
  mission TEXT,
  history TEXT,
  address VARCHAR(500),
  email VARCHAR(255),
  phone VARCHAR(50),
  office_hours VARCHAR(255),
  facebook_url VARCHAR(500),
  telegram_url VARCHAR(500),
  website_url VARCHAR(500),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  logo_url VARCHAR(500),
  banner_url VARCHAR(500),
  updated_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sectors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  mission TEXT,
  vision TEXT,
  address VARCHAR(500),
  email VARCHAR(255),
  phone VARCHAR(50),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  image_url VARCHAR(500),
  is_active TINYINT(1) DEFAULT 1,
  display_order INT DEFAULT 0,
  updated_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('pending','reviewed','resolved','archived') DEFAULT 'pending',
  updated_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  user_name VARCHAR(255),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id INT,
  details TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
"

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to create tables."
    exit 1
fi

echo "[3/3] Seeding initial data..."
mysql ${DB_NAME} -e "
INSERT INTO city_information (city_name, mayor_name, mayor_message, about_city, vision, mission, address, email, phone, office_hours, updated_by)
SELECT 'Asella City', 'Adanech Abebe', 
'Welcome to the official City Administration portal. Our administration is committed to building a modern, efficient, and transparent government that serves all citizens with dignity and respect.',
'Asella City is a prominent city serving as the political, economic, and cultural hub of the Arsi Zone. With a vibrant population, the city is known for its agricultural and economic contributions.',
'To become a model city of sustainable urban development, inclusive governance, and digital innovation by 2030.',
'To deliver efficient, transparent, and citizen-centered public services through technology-driven governance and institutional excellence.',
'Asella City, Arsi Zone, Oromia Region, Ethiopia',
'info@cityadmin.gov.et', '+251-111-551-000',
'Monday - Friday: 8:30 AM - 5:30 PM', 1
WHERE NOT EXISTS (SELECT 1 FROM city_information LIMIT 1);

INSERT INTO sectors (name, description, email, phone, address, is_active, updated_by)
SELECT * FROM (
  SELECT 'Public Works' as name, 'Responsible for infrastructure development, road maintenance, and urban planning projects across the city.' as description, 'publicworks@cityadmin.gov.et' as email, '+251-111-552-001' as phone, 'Asella City' as address, 1 as is_active, 1 as updated_by
  UNION ALL
  SELECT 'Health Bureau', 'Oversees public health services, hospital management, disease prevention programs, and emergency medical response.', 'health@cityadmin.gov.et', '+251-111-552-002', 'Asella City', 1, 1
  UNION ALL
  SELECT 'Education Office', 'Manages public schools, teacher training programs, curriculum development, and educational resource distribution.', 'education@cityadmin.gov.et', '+251-111-552-003', 'Asella City', 1, 1
  UNION ALL
  SELECT 'Revenue Authority', 'Handles tax collection, business licensing, property assessments, and financial compliance enforcement.', 'revenue@cityadmin.gov.et', '+251-111-552-004', 'Asella City', 1, 1
  UNION ALL
  SELECT 'Urban Planning', 'Responsible for zoning regulations, construction permits, land use planning, and sustainable urban growth strategies.', 'planning@cityadmin.gov.et', '+251-111-552-005', 'Asella City', 1, 1
) as tmp
WHERE NOT EXISTS (SELECT 1 FROM sectors LIMIT 1);

INSERT INTO users (username, email, password_hash, full_name, role)
SELECT 'admin', 'admin@cais.gov.et', '\$2b\$10\$UjT5T/Rfv8FbrHP1z9vS/.XajVxhDHx9OhCbPdMfta7Qh9aZkzJGq', 'Super Admin', 'SuperAdmin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@cais.gov.et');
"

echo ""
echo "============================================"
echo "  CAIS Database setup complete!"
echo "  Database: ${DB_NAME}"
echo "  User: ${DB_USER}"
echo "============================================"
