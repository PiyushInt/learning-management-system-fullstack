import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import crypto from 'crypto';
import { config } from './config/index.js';
import logger from './middlewares/logger.js';
import prisma from './utils/prisma.js';

import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.set('trust proxy', 1);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(
    cors({
        origin: config.corsOrigin,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    })
);

app.use(
    helmet({
        contentSecurityPolicy: false, // Not needed for a pure JSON API
        crossOriginEmbedderPolicy: false,
        xPoweredBy: false,
        hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }
    })
);

app.use((req, res, next) => {
    req.id = crypto.randomUUID();
    logger.info({ message: 'Incoming request', method: req.method, url: req.url, reqId: req.id });
    next();
});

app.use('/auth', authRoutes);
app.use('/courses', courseRoutes);
app.use('/assignments', assignmentRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP' });
});

app.get('/ready', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.status(200).json({ status: 'READY' });
    } catch (err) {
        logger.error({ message: 'Readiness check failed', error: err.message });
        res.status(503).json({ status: 'UNAVAILABLE' });
    }
});

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Mini LMS Backend API' });
});

app.use(errorHandler);

export default app;
