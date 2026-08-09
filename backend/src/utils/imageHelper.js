const fs = require('fs').promises;
const path = require('path');

/**
 * Verifies that an uploaded file is a genuine image by checking magic numbers (file signatures).
 * Prevents MIME type spoofing attacks where malicious files are disguised as images.
 * @param {string} filePath - Absolute path to the uploaded file
 * @throws {Error} If the file does not contain valid image magic numbers
 */
const verifyImageContent = async (filePath) => {
    const buffer = Buffer.alloc(8);
    const fileHandle = await fs.open(filePath, 'r');

    try {
        await fileHandle.read(buffer, 0, 8, 0);
    } finally {
        await fileHandle.close();
    }

    // JPEG: FF D8 FF
    const isJpeg = buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;

    // PNG: 89 50 4E 47
    const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;

    // WebP: 52 49 46 46 ... 57 45 42 50
    const isWebp = buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46;

    if (!isJpeg && !isPng && !isWebp) {
        // Remove the suspicious file to prevent persistent storage of malicious content
        await fs.unlink(filePath);
        const ApiError = require('./ApiError');
        const httpStatus = require('../constants/httpStatus');
        throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'File content does not match an allowed image format.', 'UPLOAD_INVALID_CONTENT');
    }
};

/**
 * Safely deletes an old image from the uploads directory.
 * Used during image replacement operations to prevent orphan files.
 * @param {string} relativePath - Relative URL path (e.g., /uploads/city/image.jpg)
 */
const deleteOldImage = async (relativePath) => {
    if (!relativePath) return;

    try {
        const absolutePath = path.join(__dirname, '..', relativePath);
        await fs.access(absolutePath);
        await fs.unlink(absolutePath);
    } catch (error) {
        // Silently ignore if file doesn't exist (already deleted or never existed)
    }
};

module.exports = {
    verifyImageContent,
    deleteOldImage
};
