const pino = require('pino');

/**
 * Centralized structured logger using Pino.
 * Configured for JSON output compatible with log aggregation platforms.
 */
const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV !== 'production' ? {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
            ignore: 'pid,hostname'
        }
    } : undefined
});

module.exports = logger;
