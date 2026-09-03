import app from './app.js';
import { config } from './config/index.js';
import prisma from './utils/prisma.js';
import logger from './middlewares/logger.js';

process.on('uncaughtException', (err) => {
    logger.error({ message: 'Uncaught Exception', error: err.stack });
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    logger.error({ message: 'Unhandled Rejection', reason });
    process.exit(1);
});

const startServer = async () => {
    try {
        await prisma.$connect();
        logger.info('Database connected successfully');

        const server = app.listen(config.port, () => {
            logger.info(`Server running on port ${config.port}`);
        });

        const gracefulShutdown = async (signal) => {
            logger.info(`Received ${signal}, shutting down gracefully...`);
            server.close(async () => {
                logger.info('HTTP server closed');
                await prisma.$disconnect();
                logger.info('Database connection closed');
                process.exit(0);
            });

            // Force shutdown if taking too long
            setTimeout(() => {
                logger.error('Could not close connections in time, forcefully shutting down');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    } catch (err) {
        logger.error({ message: 'Failed to start server', error: err.message });
        process.exit(1);
    }
};

startServer();
