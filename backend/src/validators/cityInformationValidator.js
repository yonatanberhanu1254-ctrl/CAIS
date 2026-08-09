const Joi = require('joi');

const createCityInfoSchema = Joi.object({
    city_name_en: Joi.string().min(2).max(255).required(),
    city_name_am: Joi.string().max(255).allow(null, ''),
    city_name_om: Joi.string().max(255).allow(null, ''),

    mayor_name: Joi.string().max(255).allow(null, ''),

    mayor_message_en: Joi.string().max(5000).allow(null, ''),
    mayor_message_am: Joi.string().max(5000).allow(null, ''),
    mayor_message_om: Joi.string().max(5000).allow(null, ''),

    welcome_message_en: Joi.string().max(5000).allow(null, ''),
    welcome_message_am: Joi.string().max(5000).allow(null, ''),
    welcome_message_om: Joi.string().max(5000).allow(null, ''),

    about_city_en: Joi.string().min(10).max(10000).required(),
    about_city_am: Joi.string().max(10000).allow(null, ''),
    about_city_om: Joi.string().max(10000).allow(null, ''),

    vision_en: Joi.string().max(2000).allow(null, ''),
    vision_am: Joi.string().max(2000).allow(null, ''),
    vision_om: Joi.string().max(2000).allow(null, ''),

    mission_en: Joi.string().max(2000).allow(null, ''),
    mission_am: Joi.string().max(2000).allow(null, ''),
    mission_om: Joi.string().max(2000).allow(null, ''),

    history_en: Joi.string().max(10000).allow(null, ''),
    history_am: Joi.string().max(10000).allow(null, ''),
    history_om: Joi.string().max(10000).allow(null, ''),

    address_en: Joi.string().max(500).allow(null, ''),
    address_am: Joi.string().max(500).allow(null, ''),
    address_om: Joi.string().max(500).allow(null, ''),

    email: Joi.string().email().max(255).allow(null, ''),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).allow(null, '').messages({
        'string.pattern.base': 'Phone must be a valid E.164 format.'
    }),
    office_hours: Joi.string().max(255).allow(null, ''),
    facebook_url: Joi.string().uri({ scheme: ['https'] }).max(255).allow(null, ''),
    telegram_url: Joi.string().uri({ scheme: ['https'] }).max(255).allow(null, ''),
    website_url: Joi.string().uri({ scheme: ['https', 'http'] }).max(255).allow(null, ''),
    latitude: Joi.number().min(-90).max(90).allow(null),
    longitude: Joi.number().min(-180).max(180).allow(null)
});

const updateCityInfoSchema = createCityInfoSchema.fork(['city_name_en', 'about_city_en'], (schema) => schema.optional());

module.exports = {
    createCityInfoSchema,
    updateCityInfoSchema
};
