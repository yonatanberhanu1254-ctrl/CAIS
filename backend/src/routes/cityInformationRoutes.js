const express = require('express');
const router = express.Router();
const cityInfoController = require('../controllers/cityInformationController');
const validate = require('../middleware/validateRequest');
const verifyToken = require('../middleware/verifyToken');
const authorize = require('../middleware/authorize');
const uploadCityImages = require('../middleware/uploadCityImages');
const { createCityInfoSchema, updateCityInfoSchema } = require('../validators/cityInformationValidator');

// Public
router.get('/', cityInfoController.getCityInformation);

// Protected (SuperAdmin only for mutations)
router.use(verifyToken);
router.use(authorize('SuperAdmin', 'DepartmentAdmin'));

router.post('/', authorize('SuperAdmin'), validate(createCityInfoSchema), cityInfoController.createCityInformation);
router.put('/', authorize('SuperAdmin'), validate(updateCityInfoSchema), cityInfoController.updateCityInformation);
router.patch('/logo', authorize('SuperAdmin'), uploadCityImages.single('logo'), cityInfoController.updateLogo);
router.patch('/banner', authorize('SuperAdmin'), uploadCityImages.single('banner'), cityInfoController.updateBanner);
router.patch('/mayor-image', authorize('SuperAdmin'), uploadCityImages.single('mayor_image'), cityInfoController.updateMayorImage);

module.exports = router;
