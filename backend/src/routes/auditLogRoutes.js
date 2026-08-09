const express = require('express');
const router = express.Router();
const auditLogController = require('../controllers/auditLogController');
const validate = require('../middleware/validateRequest');
const verifyToken = require('../middleware/verifyToken');
const authorize = require('../middleware/authorize');
const { getLogsQuerySchema } = require('../validators/auditLogValidator');

// ================= PROTECTED ADMIN ROUTES =================
// The Audit Log Module contains highly sensitive activity records.
// Public access is strictly denied.
router.use(verifyToken);

// Apply Role-Based Access Control (RBAC).
// Both DepartmentAdmin and SuperAdmin can view logs.
router.use(authorize('DepartmentAdmin', 'SuperAdmin'));

// GET /api/v1/audit-logs
// Validates complex query parameters and executes fetching
router.get('/', validate(getLogsQuerySchema, 'query'), auditLogController.getLogs);

// GET /api/v1/audit-logs/:id
// ID validation is handled gracefully by native INT checks in the service
router.get('/:id', auditLogController.getLogById);

// DELETE /api/v1/audit-logs/:id
// ONLY SuperAdmin can permanently delete audit logs (immutability rule).
// A secondary authorize block restricts the already validated session to SuperAdmin-only.
router.delete('/:id', authorize('SuperAdmin'), auditLogController.deleteLog);

module.exports = router;
