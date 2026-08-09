const Joi = require('joi');

const createSectorSchema = Joi.object({
    name_en: Joi.string().trim().min(2).max(255).required().messages({ 'any.required': 'English sector name is required.' }),
    name_am: Joi.string().trim().max(255).allow(null, '').optional(),
    name_om: Joi.string().trim().max(255).allow(null, '').optional(),

    short_description_en: Joi.string().trim().max(500).allow(null, '').optional(),
    short_description_am: Joi.string().trim().max(500).allow(null, '').optional(),
    short_description_om: Joi.string().trim().max(500).allow(null, '').optional(),

    description_en: Joi.string().trim().max(5000).required().messages({ 'any.required': 'English sector description is required.' }),
    description_am: Joi.string().trim().max(5000).allow(null, '').optional(),
    description_om: Joi.string().trim().max(5000).allow(null, '').optional(),
    
    services_en: Joi.string().trim().max(5000).allow(null, '').optional(),
    services_am: Joi.string().trim().max(5000).allow(null, '').optional(),
    services_om: Joi.string().trim().max(5000).allow(null, '').optional(),

    mission_en: Joi.string().trim().max(2000).allow(null, '').optional(),
    mission_am: Joi.string().trim().max(2000).allow(null, '').optional(),
    mission_om: Joi.string().trim().max(2000).allow(null, '').optional(),

    vision_en: Joi.string().trim().max(2000).allow(null, '').optional(),
    vision_am: Joi.string().trim().max(2000).allow(null, '').optional(),
    vision_om: Joi.string().trim().max(2000).allow(null, '').optional(),

    office_location_en: Joi.string().trim().max(500).allow(null, '').optional(),
    office_location_am: Joi.string().trim().max(500).allow(null, '').optional(),
    office_location_om: Joi.string().trim().max(500).allow(null, '').optional(),

    email: Joi.string().trim().email().allow(null, '').optional(),
    phone: Joi.string().trim().max(50).allow(null, '').optional(),
    office_hours: Joi.string().trim().max(255).allow(null, '').optional(),

    latitude: Joi.number().min(7.85).max(8.05).required()
        .messages({
            'number.min': 'This location is outside Asella City Administration. Please choose a location within Asella.',
            'number.max': 'This location is outside Asella City Administration. Please choose a location within Asella.',
            'any.required': 'Location is required.'
        }),
    longitude: Joi.number().min(39.05).max(39.20).required()
        .messages({
            'number.min': 'This location is outside Asella City Administration. Please choose a location within Asella.',
            'number.max': 'This location is outside Asella City Administration. Please choose a location within Asella.',
            'any.required': 'Location is required.'
        }),
    google_maps_url: Joi.string().trim().regex(/^https:\/\/(www\.)?google\.com\/maps\/.*$|^https:\/\/maps\.google\.com\/.*$/).allow(null, '').optional()
        .messages({
            'string.pattern.base': 'Must be a valid Google Maps URL (embed or place).'
        }),
    is_active: Joi.boolean().optional()
});

const updateSectorSchema = Joi.object({
    name_en: Joi.string().trim().min(2).max(255).optional(),
    name_am: Joi.string().trim().max(255).allow(null, '').optional(),
    name_om: Joi.string().trim().max(255).allow(null, '').optional(),

    short_description_en: Joi.string().trim().max(500).allow(null, '').optional(),
    short_description_am: Joi.string().trim().max(500).allow(null, '').optional(),
    short_description_om: Joi.string().trim().max(500).allow(null, '').optional(),

    description_en: Joi.string().trim().max(5000).optional(),
    description_am: Joi.string().trim().max(5000).allow(null, '').optional(),
    description_om: Joi.string().trim().max(5000).allow(null, '').optional(),
    
    services_en: Joi.string().trim().max(5000).allow(null, '').optional(),
    services_am: Joi.string().trim().max(5000).allow(null, '').optional(),
    services_om: Joi.string().trim().max(5000).allow(null, '').optional(),

    mission_en: Joi.string().trim().max(2000).allow(null, '').optional(),
    mission_am: Joi.string().trim().max(2000).allow(null, '').optional(),
    mission_om: Joi.string().trim().max(2000).allow(null, '').optional(),

    vision_en: Joi.string().trim().max(2000).allow(null, '').optional(),
    vision_am: Joi.string().trim().max(2000).allow(null, '').optional(),
    vision_om: Joi.string().trim().max(2000).allow(null, '').optional(),

    office_location_en: Joi.string().trim().max(500).allow(null, '').optional(),
    office_location_am: Joi.string().trim().max(500).allow(null, '').optional(),
    office_location_om: Joi.string().trim().max(500).allow(null, '').optional(),

    email: Joi.string().trim().email().allow(null, '').optional(),
    phone: Joi.string().trim().max(50).allow(null, '').optional(),
    office_hours: Joi.string().trim().max(255).allow(null, '').optional(),

    latitude: Joi.number().min(7.85).max(8.05).optional()
        .messages({
            'number.min': 'This location is outside Asella City Administration. Please choose a location within Asella.',
            'number.max': 'This location is outside Asella City Administration. Please choose a location within Asella.'
        }),
    longitude: Joi.number().min(39.05).max(39.20).optional()
        .messages({
            'number.min': 'This location is outside Asella City Administration. Please choose a location within Asella.',
            'number.max': 'This location is outside Asella City Administration. Please choose a location within Asella.'
        }),
    google_maps_url: Joi.string().trim().regex(/^https:\/\/(www\.)?google\.com\/maps\/.*$|^https:\/\/maps\.google\.com\/.*$/).allow(null, '').optional()
        .messages({
            'string.pattern.base': 'Must be a valid Google Maps URL (embed or place).'
        }),
    is_active: Joi.boolean().optional()
}).min(1);

const getSectorsQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().trim().max(100).allow('').default(''),
    sort: Joi.string().valid('name', 'created_at', 'updated_at').default('created_at'),
    order: Joi.string().valid('ASC', 'DESC', 'asc', 'desc').default('DESC'),
    lang: Joi.string().valid('en', 'am', 'om').default('en')
});

module.exports = { createSectorSchema, updateSectorSchema, getSectorsQuerySchema };
