const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const verifyToken = require('../middleware/verifyToken');
const authorize = require('../middleware/authorize');

router.use(verifyToken);
router.use(authorize('DepartmentAdmin', 'SuperAdmin'));

router.get('/', dashboardController.getDashboard);
router.get('/statistics', dashboardController.getStatistics);
router.get('/recent-messages', dashboardController.getRecentMessages);
router.get('/recent-sector-updates', dashboardController.getRecentSectorUpdates);
router.get('/recent-activities', dashboardController.getRecentActivities);
router.get('/monthly-charts', dashboardController.getMonthlyCharts);
router.get('/system-health', dashboardController.getSystemHealth);

module.exports = router;
