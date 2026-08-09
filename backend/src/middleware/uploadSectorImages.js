const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const ApiError = require('../utils/ApiError');
const httpStatus = require('../constants/httpStatus');

// Auto-create directory
const uploadDir = path.join(__dirname, '../uploads/sectors');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = crypto.randomUUID();
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `sector-${uniqueSuffix}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new ApiError(
            httpStatus.UNPROCESSABLE_ENTITY,
            'Only JPEG, PNG, and WEBP images are allowed.',
            'UPLOAD_INVALID_MIME'
        ), false);
    }
};

const uploadSectorImages = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = uploadSectorImages;
