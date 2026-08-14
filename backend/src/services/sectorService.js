const SectorModel = require('../models/SectorModel');
const ApiError = require('../utils/ApiError');
const httpStatus = require('../constants/httpStatus');
const { deleteOldImage } = require('../utils/imageHelper');
const { mapSectorLang } = require('../utils/langMapper');

class SectorService {
    async getSectors(query) {
        const { page = 1, limit = 10, search = '', sort = 'created_at', order = 'DESC', lang = 'en' } = query;
        const offset = (page - 1) * limit;
        const { rows, total } = await SectorModel.findAll({ search, sort, order, limit, offset, activeOnly: false, lang });
        return {
            sectors: rows.map(row => mapSectorLang(row, lang)),
            pagination: { page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / limit) }
        };
    }

    async getAllActiveSectors(lang = 'en') {
        const { rows } = await SectorModel.findAll({ search: '', sort: 'name', order: 'ASC', limit: 1000, offset: 0, activeOnly: true, lang });
        return rows.map(row => mapSectorLang(row, lang));
    }

    async getSectorById(id, lang = 'en') {
        const sector = await SectorModel.findById(id);
        if (!sector) throw new ApiError(httpStatus.NOT_FOUND, 'Sector not found.', 'SECTOR_NOT_FOUND');
        return mapSectorLang(sector, lang);
    }

    async createSector(data, adminId) {
        const existing = await SectorModel.findByName(data.name_en);
        if (existing) throw new ApiError(httpStatus.CONFLICT, `A sector named "${data.name_en}" already exists.`, 'SECTOR_DUPLICATE_NAME');
        data.updated_by = adminId;
        const insertId = await SectorModel.create(data);
        return await SectorModel.findById(insertId);
    }

    async updateSector(id, data, adminId) {
        const exists = await SectorModel.exists(id);
        if (!exists) throw new ApiError(httpStatus.NOT_FOUND, 'Sector not found.', 'SECTOR_NOT_FOUND');
        if (data.name_en) {
            const duplicate = await SectorModel.findByName(data.name_en, id);
            if (duplicate) throw new ApiError(httpStatus.CONFLICT, `A sector named "${data.name_en}" already exists.`, 'SECTOR_DUPLICATE_NAME');
        }
        data.updated_by = adminId;
        await SectorModel.update(id, data);
        return await SectorModel.findById(id);
    }

    async updateSectorImage(id, imageUrl, adminId) {
        const existing = await SectorModel.findById(id);
        if (!existing) throw new ApiError(httpStatus.NOT_FOUND, 'Sector not found.', 'SECTOR_NOT_FOUND');
        // Delete old image
        if (existing.image_url) await deleteOldImage(existing.image_url);
        await SectorModel.updateImage(id, imageUrl, adminId);
        return await SectorModel.findById(id);
    }

    async toggleStatus(id, isActive, adminId) {
        const exists = await SectorModel.exists(id);
        if (!exists) throw new ApiError(httpStatus.NOT_FOUND, 'Sector not found.', 'SECTOR_NOT_FOUND');
        await SectorModel.updateStatus(id, isActive, adminId);
        return await SectorModel.findById(id);
    }

    async deleteSector(id) {
        const existing = await SectorModel.findById(id);
        if (!existing) throw new ApiError(httpStatus.NOT_FOUND, 'Sector not found.', 'SECTOR_NOT_FOUND');
        if (existing.image_url) await deleteOldImage(existing.image_url);
        return await SectorModel.delete(id);
    }
}

module.exports = new SectorService();
