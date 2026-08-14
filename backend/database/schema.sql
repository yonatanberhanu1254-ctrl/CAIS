-- ============================================================
-- CAIS - City Administration Information System
-- Full Database Schema + Seed Data (Multilingual)
-- Asella City, Arsi Zone, Oromia Region, Ethiopia
-- ============================================================

CREATE DATABASE IF NOT EXISTS cais_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cais_db;

-- ============================================================
-- TABLE: admins
-- ============================================================
CREATE TABLE IF NOT EXISTS admins (
    id              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    email           VARCHAR(255)    NOT NULL UNIQUE,
    password_hash   VARCHAR(255)    NOT NULL,
    full_name       VARCHAR(255)    NOT NULL DEFAULT '',
    phone           VARCHAR(50)     NULL,
    role            ENUM('SuperAdmin','DepartmentAdmin') NOT NULL DEFAULT 'DepartmentAdmin',
    profile_image_url VARCHAR(500)  NULL,
    is_active       TINYINT(1)      NOT NULL DEFAULT 1,
    last_login_at   DATETIME        NULL,
    created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_email (email),
    INDEX idx_role  (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: sectors
-- ============================================================
CREATE TABLE IF NOT EXISTS sectors (
    id                  INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    name_en             VARCHAR(255)    NOT NULL UNIQUE,
    name_am             VARCHAR(255)    NULL,
    name_om             VARCHAR(255)    NULL,
    description_en      TEXT            NOT NULL,
    description_am      TEXT            NULL,
    description_om      TEXT            NULL,
    short_description_en VARCHAR(500)   NULL,
    short_description_am VARCHAR(500)   NULL,
    short_description_om VARCHAR(500)   NULL,
    mission_en          TEXT            NULL,
    mission_am          TEXT            NULL,
    mission_om          TEXT            NULL,
    vision_en           TEXT            NULL,
    vision_am           TEXT            NULL,
    vision_om           TEXT            NULL,
    services_en         TEXT            NULL,
    services_am         TEXT            NULL,
    services_om         TEXT            NULL,
    office_location_en  VARCHAR(500)    NULL,
    office_location_am  VARCHAR(500)    NULL,
    office_location_om  VARCHAR(500)    NULL,
    email               VARCHAR(255)    NULL,
    phone               VARCHAR(50)     NULL,
    office_hours        VARCHAR(255)    NULL,
    latitude            DECIMAL(10,7)   NULL,
    longitude           DECIMAL(10,7)   NULL,
    google_maps_url     TEXT            NULL,
    image_url           VARCHAR(500)    NULL,
    is_active           TINYINT(1)      NOT NULL DEFAULT 1,
    updated_by          INT UNSIGNED    NULL,
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_name_en   (name_en),
    INDEX idx_is_active (is_active),
    INDEX idx_updated_at (updated_at),
    CONSTRAINT fk_sectors_admin FOREIGN KEY (updated_by) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: city_information (singleton)
-- ============================================================
CREATE TABLE IF NOT EXISTS city_information (
    id                  INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    city_name_en        VARCHAR(255)    NOT NULL DEFAULT 'Asella City',
    city_name_am        VARCHAR(255)    NULL,
    city_name_om        VARCHAR(255)    NULL,
    mayor_name          VARCHAR(255)    NULL,
    mayor_message_en    TEXT            NULL,
    mayor_message_am    TEXT            NULL,
    mayor_message_om    TEXT            NULL,
    welcome_message_en  TEXT            NULL,
    welcome_message_am  TEXT            NULL,
    welcome_message_om  TEXT            NULL,
    mayor_image_url     VARCHAR(500)    NULL,
    about_city_en       TEXT            NULL,
    about_city_am       TEXT            NULL,
    about_city_om       TEXT            NULL,
    vision_en           TEXT            NULL,
    vision_am           TEXT            NULL,
    vision_om           TEXT            NULL,
    mission_en          TEXT            NULL,
    mission_am          TEXT            NULL,
    mission_om          TEXT            NULL,
    history_en          TEXT            NULL,
    history_am          TEXT            NULL,
    history_om          TEXT            NULL,
    address_en          VARCHAR(500)    NULL,
    address_am          VARCHAR(500)    NULL,
    address_om          VARCHAR(500)    NULL,
    email               VARCHAR(255)    NULL,
    phone               VARCHAR(50)     NULL,
    office_hours        VARCHAR(255)    NULL,
    facebook_url        VARCHAR(500)    NULL,
    telegram_url        VARCHAR(500)    NULL,
    website_url         VARCHAR(500)    NULL,
    latitude            DECIMAL(10,7)   NULL,
    longitude           DECIMAL(10,7)   NULL,
    logo_url            VARCHAR(500)    NULL,
    banner_url          VARCHAR(500)    NULL,
    updated_by          INT UNSIGNED    NULL,
    created_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_cityinfo_admin FOREIGN KEY (updated_by) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: contact_messages
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    full_name   VARCHAR(255)    NOT NULL,
    email       VARCHAR(255)    NOT NULL,
    phone       VARCHAR(50)     NULL,
    subject     VARCHAR(500)    NOT NULL,
    message     TEXT            NOT NULL,
    status      ENUM('Unread','Read','Archived') NOT NULL DEFAULT 'Unread',
    ip_address  VARCHAR(45)     NULL,
    user_agent  VARCHAR(500)    NULL,
    updated_by  INT UNSIGNED    NULL,
    submitted_at DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_status       (status),
    INDEX idx_submitted_at (submitted_at),
    CONSTRAINT fk_messages_admin FOREIGN KEY (updated_by) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: audit_logs
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    admin_id    INT UNSIGNED    NULL,
    action      VARCHAR(100)    NOT NULL,
    entity_type VARCHAR(100)    NULL,
    entity_id   INT UNSIGNED    NULL,
    description TEXT            NULL,
    ip_address  VARCHAR(45)     NULL,
    user_agent  VARCHAR(500)    NULL,
    request_id  VARCHAR(100)    NULL,
    status      ENUM('SUCCESS','FAILURE') NOT NULL DEFAULT 'SUCCESS',
    created_at  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_admin_id  (admin_id),
    INDEX idx_action    (action),
    INDEX idx_created_at (created_at),
    CONSTRAINT fk_audit_admin FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SEED DATA
-- ============================================================

-- Admin user: admin@cais.gov.et / Admin@123
INSERT IGNORE INTO admins (email, password_hash, full_name, phone, role, is_active)
VALUES (
    'admin@cais.gov.et',
    '$2b$10$j6.sGKQ0z2W457BdaVs1hODpx./4n7zvRwRUgIsw7PdjOFkAHYIl2',
    'System Administrator',
    '+251222680001',
    'SuperAdmin',
    1
);

-- City Information
INSERT IGNORE INTO city_information (city_name_en, mayor_name, mayor_message_en, about_city_en, vision_en, mission_en, history_en, address_en, email, phone, office_hours, latitude, longitude)
VALUES (
    'Asella City',
    'Mayor Girma Tesfaye',
    'Welcome to the official digital portal of Asella City Administration. We are committed to delivering transparent, efficient, and citizen-centered government services. Together, we are building a prosperous and sustainable future for every resident of our beloved city.',
    'Asella is the capital city of the Arsi Zone in the Oromia Region of Ethiopia. Located at an altitude of approximately 2,430 meters above sea level, Asella is known for its cool climate, fertile agricultural land, and vibrant community. The city serves as a major administrative, commercial, and educational hub for the surrounding region.',
    'To become a model city in Oromia — a smart, inclusive, and resilient urban center that delivers world-class services and opportunities for all citizens.',
    'To provide efficient, transparent, and equitable public services that empower citizens, foster economic growth, and promote sustainable development in Asella City and the Arsi Zone.',
    'Asella has a rich history dating back centuries. It was officially established as a town during the Italian occupation and has grown significantly since Ethiopian independence. The city played a pivotal role in the 1974 revolution and continues to evolve as a center of education, agriculture, and regional commerce.',
    'City Hall, Asella, Arsi Zone, Oromia, Ethiopia',
    'info@asellacity.gov.et',
    '+251222680000',
    'Monday - Friday: 8:00 AM - 5:00 PM',
    7.9500,
    39.1333
);

-- Sectors
INSERT IGNORE INTO sectors (name_en, short_description_en, description_en, mission_en, vision_en, office_location_en, email, phone, office_hours, latitude, longitude, google_maps_url, is_active, updated_by)
SELECT 'Administration Office', 'Central administrative governance', 'The Administration Office coordinates citywide governance and administrative policies for Asella City.', 'To ensure seamless delivery of administrative services to all citizens.', 'A model administration office for Oromia Region.', 'City Hall, Floor 1, Asella', 'admin@asellacity.gov.et', '+251222680001', 'Mon-Fri 8am-5pm', 7.9502, 39.1335, 'https://maps.google.com/maps?q=7.9502,39.1335&t=&z=15&ie=UTF8&iwloc=&output=embed', 1, id FROM admins WHERE email='admin@cais.gov.et' LIMIT 1;

INSERT IGNORE INTO sectors (name_en, short_description_en, description_en, mission_en, vision_en, office_location_en, email, phone, office_hours, latitude, longitude, google_maps_url, is_active, updated_by)
SELECT 'Finance Office', 'Manages city budget and taxes', 'Responsible for revenue collection, budgeting, and financial planning for Asella City.', 'To manage public finances with transparency and accountability.', 'A financially strong city government serving all residents.', 'Finance Building, Room 201, Asella', 'finance@asellacity.gov.et', '+251222680002', 'Mon-Fri 8am-4pm', 7.9498, 39.1330, 'https://maps.google.com/maps?q=7.9498,39.1330&t=&z=15&ie=UTF8&iwloc=&output=embed', 1, id FROM admins WHERE email='admin@cais.gov.et' LIMIT 1;

INSERT IGNORE INTO sectors (name_en, short_description_en, description_en, mission_en, vision_en, office_location_en, email, phone, office_hours, latitude, longitude, google_maps_url, is_active, updated_by)
SELECT 'Health Office', 'Public health and sanitation', 'Oversees public health clinics, sanitation programs, and disease prevention in Asella City.', 'To promote and protect the health of every citizen in Asella.', 'A healthy community with access to quality healthcare for all.', 'Health Center, 1st Avenue, Asella', 'health@asellacity.gov.et', '+251222680003', '24/7', 7.9510, 39.1340, 'https://maps.google.com/maps?q=7.9510,39.1340&t=&z=15&ie=UTF8&iwloc=&output=embed', 1, id FROM admins WHERE email='admin@cais.gov.et' LIMIT 1;

INSERT IGNORE INTO sectors (name_en, short_description_en, description_en, mission_en, vision_en, office_location_en, email, phone, office_hours, latitude, longitude, google_maps_url, is_active, updated_by)
SELECT 'Education Office', 'Manages public education systems', 'Coordinates schools, adult education programs, and community libraries across Asella City.', 'To ensure quality education for all children and adults in Asella.', 'An educated, empowered community driving regional development.', 'Education Complex, Block B, Asella', 'education@asellacity.gov.et', '+251222680004', 'Mon-Fri 8am-4pm', 7.9495, 39.1325, 'https://maps.google.com/maps?q=7.9495,39.1325&t=&z=15&ie=UTF8&iwloc=&output=embed', 1, id FROM admins WHERE email='admin@cais.gov.et' LIMIT 1;

INSERT IGNORE INTO sectors (name_en, short_description_en, description_en, mission_en, vision_en, office_location_en, email, phone, office_hours, latitude, longitude, google_maps_url, is_active, updated_by)
SELECT 'Agriculture Office', 'Farming and rural development', 'Supports local farmers, agricultural grants, and sustainability programs for the Arsi Zone.', 'To promote sustainable agriculture and food security in Asella.', 'A prosperous agricultural sector supporting the entire Arsi Zone.', 'Green Building, 3rd Floor, Asella', 'agri@asellacity.gov.et', '+251222680005', 'Mon-Fri 7am-3pm', 7.9520, 39.1350, 'https://maps.google.com/maps?q=7.9520,39.1350&t=&z=15&ie=UTF8&iwloc=&output=embed', 1, id FROM admins WHERE email='admin@cais.gov.et' LIMIT 1;

INSERT IGNORE INTO sectors (name_en, short_description_en, description_en, mission_en, vision_en, office_location_en, email, phone, office_hours, latitude, longitude, google_maps_url, is_active, updated_by)
SELECT 'Water & Sanitation Office', 'Water supply and treatment', 'Maintains city water infrastructure, safety standards, and sewage systems for Asella City.', 'To provide clean, safe, and reliable water to every household in Asella.', 'A city where every resident has access to clean water and sanitation.', 'Water Department, South Wing, Asella', 'water@asellacity.gov.et', '+251222680006', '24/7', 7.9485, 39.1320, 'https://maps.google.com/maps?q=7.9485,39.1320&t=&z=15&ie=UTF8&iwloc=&output=embed', 1, id FROM admins WHERE email='admin@cais.gov.et' LIMIT 1;

INSERT IGNORE INTO sectors (name_en, short_description_en, description_en, mission_en, vision_en, office_location_en, email, phone, office_hours, latitude, longitude, google_maps_url, is_active, updated_by)
SELECT 'Land Administration Office', 'Zoning and land registry', 'Handles property registration, urban zoning, and land dispute resolution in Asella City.', 'To ensure fair, transparent, and efficient land administration for all citizens.', 'An organized urban environment with clear and equitable land rights.', 'City Hall Annex, Floor 4, Asella', 'land@asellacity.gov.et', '+251222680007', 'Mon-Fri 8am-5pm', 7.9505, 39.1345, 'https://maps.google.com/maps?q=7.9505,39.1345&t=&z=15&ie=UTF8&iwloc=&output=embed', 1, id FROM admins WHERE email='admin@cais.gov.et' LIMIT 1;

INSERT IGNORE INTO sectors (name_en, short_description_en, description_en, mission_en, vision_en, office_location_en, email, phone, office_hours, latitude, longitude, google_maps_url, is_active, updated_by)
SELECT 'Women & Children Affairs Office', 'Empowerment and equality', 'Promotes women''s rights, children''s welfare, equal opportunities, and support services in Asella.', 'To empower women and protect children across Asella City.', 'A city where women and children thrive with dignity and opportunity.', 'Community Center, Room 12, Asella', 'women@asellacity.gov.et', '+251222680008', 'Mon-Fri 9am-5pm', 7.9492, 39.1328, 'https://maps.google.com/maps?q=7.9492,39.1328&t=&z=15&ie=UTF8&iwloc=&output=embed', 1, id FROM admins WHERE email='admin@cais.gov.et' LIMIT 1;

INSERT IGNORE INTO sectors (name_en, short_description_en, description_en, mission_en, vision_en, office_location_en, email, phone, office_hours, latitude, longitude, google_maps_url, is_active, updated_by)
SELECT 'Youth & Sports Office', 'Youth programs and recreation', 'Coordinates sports leagues, youth centers, and recreational activities throughout Asella City.', 'To empower youth through sports, education, and community engagement.', 'A dynamic, youthful city leading Oromia in sports and culture.', 'Sports Arena Plaza, Asella', 'youth@asellacity.gov.et', '+251222680009', 'Tue-Sat 10am-6pm', 7.9515, 39.1355, 'https://maps.google.com/maps?q=7.9515,39.1355&t=&z=15&ie=UTF8&iwloc=&output=embed', 1, id FROM admins WHERE email='admin@cais.gov.et' LIMIT 1;

INSERT IGNORE INTO sectors (name_en, short_description_en, description_en, mission_en, vision_en, office_location_en, email, phone, office_hours, latitude, longitude, google_maps_url, is_active, updated_by)
SELECT 'Trade & Industry Office', 'Commerce and local business', 'Business licensing, market regulation, and economic development for Asella City.', 'To foster a thriving business environment that creates jobs and prosperity.', 'Asella as a leading commercial hub in the Arsi Zone.', 'Commerce Tower, 2nd Floor, Asella', 'trade@asellacity.gov.et', '+251222680010', 'Mon-Fri 8am-5pm', 7.9488, 39.1318, 'https://maps.google.com/maps?q=7.9488,39.1318&t=&z=15&ie=UTF8&iwloc=&output=embed', 1, id FROM admins WHERE email='admin@cais.gov.et' LIMIT 1;

-- Sample contact messages
INSERT IGNORE INTO contact_messages (full_name, email, phone, subject, message, status, ip_address)
VALUES
    ('Abebe Bekele', 'abebe@email.com', '+251911234567', 'Water Supply Complaint', 'The water supply in our neighborhood has been irregular for the past two weeks. Please investigate.', 'Unread', '192.168.1.1'),
    ('Tigist Haile', 'tigist@email.com', NULL, 'School Enrollment Inquiry', 'I would like to enroll my daughter in the public school for the next academic year. Please advise on the procedure.', 'Unread', '192.168.1.2'),
    ('Mohammed Ali', 'mohammed@email.com', '+251922345678', 'Land Registration Request', 'I need assistance with registering my property. Please let me know the required documents.', 'Read', '192.168.1.3'),
    ('Yeshi Tadesse', 'yeshi@email.com', NULL, 'Road Maintenance Request', 'The road in front of our market area needs urgent repair. Many potholes are causing accidents.', 'Unread', '192.168.1.4'),
    ('Gemechu Dida', 'gemechu@email.com', '+251933456789', 'Business License Inquiry', 'I want to open a small restaurant. What are the requirements for a business license?', 'Read', '192.168.1.5');

-- Sample audit logs
INSERT IGNORE INTO audit_logs (admin_id, action, entity_type, entity_id, description, ip_address, status)
SELECT id, 'LOGIN', 'Admin', id, 'SuperAdmin logged into the system', '127.0.0.1', 'SUCCESS' FROM admins WHERE email='admin@cais.gov.et' LIMIT 1;

INSERT IGNORE INTO audit_logs (admin_id, action, entity_type, description, ip_address, status)
SELECT id, 'UPDATE_CITY_INFO', 'CityInformation', 'City information was initialized', '127.0.0.1', 'SUCCESS' FROM admins WHERE email='admin@cais.gov.et' LIMIT 1;

INSERT IGNORE INTO audit_logs (admin_id, action, entity_type, description, ip_address, status)
SELECT id, 'CREATE_SECTOR', 'Sector', '10 initial sectors were seeded into the database', '127.0.0.1', 'SUCCESS' FROM admins WHERE email='admin@cais.gov.et' LIMIT 1;
