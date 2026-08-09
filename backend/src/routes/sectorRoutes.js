const express = require('express');
const router = express.Router();
const sectorController = require('../controllers/sectorController');
const validate = require('../middleware/validateRequest');
const verifyToken = require('../middleware/verifyToken');
const authorize = require('../middleware/authorize');
const uploadSectorImages = require('../middleware/uploadSectorImages');
const { createSectorSchema, updateSectorSchema, getSectorsQuerySchema } = require('../validators/sectorValidator');

// ====== PUBLIC ROUTES ======
router.get('/all', sectorController.getAllActiveSectors);
router.get('/:id', sectorController.getSectorById);

// ====== PROTECTED ADMIN ROUTES ======
router.use(verifyToken);
router.use(authorize('SuperAdmin', 'DepartmentAdmin'));

router.get('/', validate(getSectorsQuerySchema, 'query'), sectorController.getSectors);
router.post('/', validate(createSectorSchema), sectorController.createSector);
router.put('/:id', validate(updateSectorSchema), sectorController.updateSector);
router.patch('/:id/image', uploadSectorImages.single('image'), sectorController.uploadSectorImage);
router.patch('/:id/status', sectorController.toggleSectorStatus);
router.delete('/:id', authorize('SuperAdmin'), sectorController.deleteSector);

module.exports = router;
