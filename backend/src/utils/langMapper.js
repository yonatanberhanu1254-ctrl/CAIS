const mapCityInfoLang = (data, lang = 'en') => {
    if (!data) return data;
    const validLang = ['en', 'am', 'om'].includes(lang) ? lang : 'en';

    if (data.city_name_en !== undefined) {
        data.city_name = data[`city_name_${validLang}`] || data.city_name_en;
        data.mayor_message = data[`mayor_message_${validLang}`] || data.mayor_message_en;
        data.welcome_message = data[`welcome_message_${validLang}`] || data.welcome_message_en;
        data.about_city = data[`about_city_${validLang}`] || data.about_city_en;
        data.history = data[`history_${validLang}`] || data.history_en;
        data.vision = data[`vision_${validLang}`] || data.vision_en;
        data.mission = data[`mission_${validLang}`] || data.mission_en;
        data.address = data[`address_${validLang}`] || data.address_en;
    }
    
    return data;
};

const mapSectorLang = (data, lang = 'en') => {
    if (!data) return data;
    const validLang = ['en', 'am', 'om'].includes(lang) ? lang : 'en';

    if (data.name_en !== undefined) {
        data.name = data[`name_${validLang}`] || data.name_en;
        data.description = data[`description_${validLang}`] || data.description_en;
        data.short_description = data[`short_description_${validLang}`] || data.short_description_en;
        data.services = data[`services_${validLang}`] || data.services_en;
        data.mission = data[`mission_${validLang}`] || data.mission_en;
        data.vision = data[`vision_${validLang}`] || data.vision_en;
        data.address = data[`office_location_${validLang}`] || data.office_location_en;
    }
    
    return data;
};

module.exports = { mapCityInfoLang, mapSectorLang };
