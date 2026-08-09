-- ============================================================
-- Migration: Add Multilingual Support
-- ============================================================

USE cais_db;

-- 1. Extend city_information table
ALTER TABLE city_information
    ADD COLUMN city_name_en VARCHAR(255) NULL,
    ADD COLUMN city_name_am VARCHAR(255) NULL,
    ADD COLUMN city_name_om VARCHAR(255) NULL,
    
    ADD COLUMN history_en TEXT NULL,
    ADD COLUMN history_am TEXT NULL,
    ADD COLUMN history_om TEXT NULL,
    
    ADD COLUMN vision_en TEXT NULL,
    ADD COLUMN vision_am TEXT NULL,
    ADD COLUMN vision_om TEXT NULL,
    
    ADD COLUMN mission_en TEXT NULL,
    ADD COLUMN mission_am TEXT NULL,
    ADD COLUMN mission_om TEXT NULL,
    
    ADD COLUMN mayor_message_en TEXT NULL,
    ADD COLUMN mayor_message_am TEXT NULL,
    ADD COLUMN mayor_message_om TEXT NULL,
    
    ADD COLUMN welcome_message_en TEXT NULL,
    ADD COLUMN welcome_message_am TEXT NULL,
    ADD COLUMN welcome_message_om TEXT NULL,
    
    ADD COLUMN address_en VARCHAR(500) NULL,
    ADD COLUMN address_am VARCHAR(500) NULL,
    ADD COLUMN address_om VARCHAR(500) NULL,

    ADD COLUMN about_city_en TEXT NULL,
    ADD COLUMN about_city_am TEXT NULL,
    ADD COLUMN about_city_om TEXT NULL;

-- 2. Migrate existing data for city_information
UPDATE city_information SET
    city_name_en = city_name,
    history_en = history,
    vision_en = vision,
    mission_en = mission,
    mayor_message_en = mayor_message,
    address_en = address,
    about_city_en = about_city;

-- Ensure English fields are not null where required (though we drop original constraints later, we can keep them null for now or not null)
-- 3. Drop old columns from city_information
ALTER TABLE city_information
    DROP COLUMN city_name,
    DROP COLUMN history,
    DROP COLUMN vision,
    DROP COLUMN mission,
    DROP COLUMN mayor_message,
    DROP COLUMN address,
    DROP COLUMN about_city;

-- 4. Extend sectors table
ALTER TABLE sectors
    ADD COLUMN name_en VARCHAR(255) NULL,
    ADD COLUMN name_am VARCHAR(255) NULL,
    ADD COLUMN name_om VARCHAR(255) NULL,
    
    ADD COLUMN description_en TEXT NULL,
    ADD COLUMN description_am TEXT NULL,
    ADD COLUMN description_om TEXT NULL,
    
    ADD COLUMN short_description_en VARCHAR(500) NULL,
    ADD COLUMN short_description_am VARCHAR(500) NULL,
    ADD COLUMN short_description_om VARCHAR(500) NULL,
    
    ADD COLUMN services_en TEXT NULL,
    ADD COLUMN services_am TEXT NULL,
    ADD COLUMN services_om TEXT NULL,
    
    ADD COLUMN mission_en TEXT NULL,
    ADD COLUMN mission_am TEXT NULL,
    ADD COLUMN mission_om TEXT NULL,
    
    ADD COLUMN vision_en TEXT NULL,
    ADD COLUMN vision_am TEXT NULL,
    ADD COLUMN vision_om TEXT NULL,
    
    ADD COLUMN office_location_en VARCHAR(500) NULL,
    ADD COLUMN office_location_am VARCHAR(500) NULL,
    ADD COLUMN office_location_om VARCHAR(500) NULL;

-- 5. Migrate existing data for sectors
UPDATE sectors SET
    name_en = name,
    description_en = description,
    short_description_en = short_description,
    mission_en = mission,
    vision_en = vision,
    office_location_en = address;

-- 6. Drop old columns from sectors and index
-- Since name was unique, we should drop the index before dropping the column.
ALTER TABLE sectors DROP INDEX idx_name;

ALTER TABLE sectors
    DROP COLUMN name,
    DROP COLUMN description,
    DROP COLUMN short_description,
    DROP COLUMN mission,
    DROP COLUMN vision,
    DROP COLUMN address;

-- Re-add index for name_en
ALTER TABLE sectors ADD INDEX idx_name_en (name_en);
