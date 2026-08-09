const app = require('./app');
const db = require('./config/db');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    // 1. Test database connection first
    await db.testConnection();

    // 2. Start Express server only if DB connection succeeds
    app.listen(PORT, () => {
        console.log(`CAIS API Server running on port ${PORT}`);
    });
};

startServer();
