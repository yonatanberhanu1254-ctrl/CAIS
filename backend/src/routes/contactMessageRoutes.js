const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const contactMessageController = require('../controllers/contactMessageController');
const validate = require('../middleware/validateRequest');
const verifyToken = require('../middleware/verifyToken');
const authorize = require('../middleware/authorize');
const { submitMessageSchema, updateStatusSchema, getMessagesQuerySchema } = require('../validators/contactMessageValidator');

// ================= PUBLIC ROUTES =================
// Protect the public submission endpoint with strict rate limiting to prevent spam
const submissionLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: {
        success: false,
        message: 'Too many messages submitted from this IP, please try again after 15 minutes.',
        code: 'RATE_LIMITED'
    }
});

router.post('/', submissionLimiter, validate(submitMessageSchema), contactMessageController.submitMessage);


// ================= PROTECTED ADMIN ROUTES =================
router.use(verifyToken);

// Both SuperAdmin and DepartmentAdmin can view messages and update their status
router.get('/', authorize('SuperAdmin', 'DepartmentAdmin'), validate(getMessagesQuerySchema, 'query'), contactMessageController.getMessages);
router.get('/:id', authorize('SuperAdmin', 'DepartmentAdmin'), contactMessageController.getMessageById);
router.patch('/:id/status', authorize('SuperAdmin', 'DepartmentAdmin'), validate(updateStatusSchema), contactMessageController.updateStatus);

// ONLY SuperAdmin can permanently delete messages from the database
router.delete('/:id', authorize('SuperAdmin'), contactMessageController.deleteMessage);

module.exports = router;
