const CityInformationModel = require('../models/CityInformationModel');
const ApiError = require('../utils/ApiError');
const httpStatus = require('../constants/httpStatus');
const { deleteOldImage } = require('../utils/imageHelper');
const { mapCityInfoLang } = require('../utils/langMapper');

class CityInformationService {

    async getCityInformation(lang = 'en') {
        const info = await CityInformationModel.find();
        if (!info) throw new ApiError(httpStatus.NOT_FOUND, 'City information has not been configured yet.', 'CITY_INFO_NOT_FOUND');
        return mapCityInfoLang(info, lang);
    }

    async createCityInformation(data, adminId) {
        const exists = await CityInformationModel.exists();
        if (exists) throw new ApiError(httpStatus.CONFLICT, 'City information already exists. Use PUT to update.', 'CITY_INFO_CONFLICT');
        await CityInformationModel.create({ ...data, updated_by: adminId });
        return this.getCityInformation();
    }

    async updateCityInformation(data, adminId) {
        const exists = await CityInformationModel.exists();
        if (!exists) throw new ApiError(httpStatus.NOT_FOUND, 'City information does not exist. Use POST to create it first.', 'CITY_INFO_NOT_FOUND');
        await CityInformationModel.update({ ...data, updated_by: adminId });
        return this.getCityInformation();
    }

    async updateLogo(relativeFilePath, adminId) {
        const info = await CityInformationModel.find();
        if (!info) { await deleteOldImage(relativeFilePath); throw new ApiError(httpStatus.NOT_FOUND, 'City information does not exist.', 'CITY_INFO_NOT_FOUND'); }
        if (info.logo_url) await deleteOldImage(info.logo_url);
        await CityInformationModel.updateLogo(relativeFilePath, adminId);
        return this.getCityInformation();
    }

    async updateBanner(relativeFilePath, adminId) {
        const info = await CityInformationModel.find();
        if (!info) { await deleteOldImage(relativeFilePath); throw new ApiError(httpStatus.NOT_FOUND, 'City information does not exist.', 'CITY_INFO_NOT_FOUND'); }
        if (info.banner_url) await deleteOldImage(info.banner_url);
        await CityInformationModel.updateBanner(relativeFilePath, adminId);
        return this.getCityInformation();
    }

    async updateMayorImage(relativeFilePath, adminId) {
        const info = await CityInformationModel.find();
        if (!info) { await deleteOldImage(relativeFilePath); throw new ApiError(httpStatus.NOT_FOUND, 'City information does not exist.', 'CITY_INFO_NOT_FOUND'); }
        if (info.mayor_image_url) await deleteOldImage(info.mayor_image_url);
        await CityInformationModel.updateMayorImage(relativeFilePath, adminId);
        return this.getCityInformation();
    }
}

module.exports = new CityInformationService();
