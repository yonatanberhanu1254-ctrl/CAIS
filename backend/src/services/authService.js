const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const ApiError = require('../utils/ApiError');
const httpStatus = require('../constants/httpStatus');

exports.loginUser = async (email, password) => {
    const [rows] = await db.execute('SELECT * FROM admins WHERE email = ?', [email]);
    if (!rows || rows.length === 0) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
    }
    const user = rows[0];
    if (!user.is_active) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Account has been disabled');
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordMatch) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
    }

    // Update last_login_at
    await db.execute('UPDATE admins SET last_login_at = NOW() WHERE id = ?', [user.id]);

    const payload = { id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });

    delete user.password_hash;
    return { token, user };
};

exports.getProfile = async (adminId) => {
    const [rows] = await db.execute(
        'SELECT id, email, full_name, phone, role, profile_image_url, is_active, last_login_at, created_at FROM admins WHERE id = ?',
        [adminId]
    );
    if (!rows || rows.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
    }
    return rows[0];
};

exports.updateProfile = async (adminId, data) => {
    const allowedFields = ['full_name', 'email', 'phone'];
    const fields = [];
    const params = [];
    for (const [key, value] of Object.entries(data)) {
        if (allowedFields.includes(key) && value !== undefined) {
            fields.push(`${key} = ?`);
            params.push(value);
        }
    }
    if (fields.length === 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No valid fields to update');
    }
    params.push(adminId);
    await db.execute(`UPDATE admins SET ${fields.join(', ')} WHERE id = ?`, params);
    return exports.getProfile(adminId);
};

exports.changePassword = async (adminId, oldPassword, newPassword) => {
    const [rows] = await db.execute('SELECT password_hash FROM admins WHERE id = ?', [adminId]);
    if (!rows || rows.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
    }
    const isMatch = await bcrypt.compare(oldPassword, rows[0].password_hash);
    if (!isMatch) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Current password is incorrect');
    }
    if (newPassword.length < 8) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'New password must be at least 8 characters');
    }
    const hash = await bcrypt.hash(newPassword, 10);
    await db.execute('UPDATE admins SET password_hash = ? WHERE id = ?', [hash, adminId]);
    return true;
};

exports.updateProfileImage = async (adminId, relativePath) => {
    const fs = require('fs');
    const path = require('path');
    // Delete old profile image if exists
    const [rows] = await db.execute('SELECT profile_image_url FROM admins WHERE id = ?', [adminId]);
    if (rows && rows[0] && rows[0].profile_image_url) {
        const oldPath = path.join(__dirname, '../../', rows[0].profile_image_url);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    await db.execute('UPDATE admins SET profile_image_url = ? WHERE id = ?', [relativePath, adminId]);
    return exports.getProfile(adminId);
};
