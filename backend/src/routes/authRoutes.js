const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken');
const uploadSectorImages = require('../middleware/uploadSectorImages');

// Public routes
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Protected routes (require JWT)
router.get('/profile', verifyToken, authController.getProfile);
router.put('/profile', verifyToken, authController.updateProfile);
router.post('/change-password', verifyToken, authController.changePassword);
router.patch('/profile-image', verifyToken, uploadSectorImages.single('profile_image'), authController.updateProfileImage);

module.exports = router;
