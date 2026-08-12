require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const setupSwagger = require('./config/swagger');

const app = express();

app.use(helmet());
app.use(cors({
    origin: [
        'http://localhost:8080',
        'http://localhost:4173',
        process.env.CLIENT_URL
    ].filter(Boolean),
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

setupSwagger(app);

app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});

// Route registrations
const authRoutes = require('./routes/authRoutes');
const auditLogRoutes = require('./routes/auditLogRoutes');
const cityInformationRoutes = require('./routes/cityInformationRoutes');
const contactMessageRoutes = require('./routes/contactMessageRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/audit-logs', auditLogRoutes);
app.use('/api/v1/city-information', cityInformationRoutes);
app.use('/api/v1/contact-messages', contactMessageRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// Sector routes
const sectorRoutes = require('./routes/sectorRoutes');
app.use('/api/v1/sectors', sectorRoutes);

// ================= GLOBAL ERROR HANDLER =================
// Must be registered AFTER all routes. Catches any thrown/next(err) errors
// and returns structured JSON instead of Express's default HTML error page.
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = statusCode === 500 && process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message || 'Internal server error';

    res.status(statusCode).json({
        success: false,
        message: message,
        code: err.code || 'INTERNAL_ERROR',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

module.exports = app;
