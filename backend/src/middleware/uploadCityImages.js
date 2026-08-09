const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const ApiError = require('../utils/ApiError');
const httpStatus = require('../constants/httpStatus');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Stores specifically in the city uploads directory
        cb(null, path.join(__dirname, '../uploads/city'));
    },
    filename: (req, file, cb) => {
        // Random UUID prevents filename collision and brute-force traversal
        const uniqueSuffix = crypto.randomUUID();
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${uniqueSuffix}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Only JPEG, PNG, and WEBP images are allowed.', 'UPLOAD_INVALID_MIME'), false);
    }
};

const uploadCityImages = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Hardcap at 5MB
    }
});

module.exports = uploadCityImages;
