import request from 'supertest';
import app from '../src/app.js';
import prisma from '../src/utils/prisma.js';
import logger from '../src/middlewares/logger.js';
import winston from 'winston';
import { loginLimiter } from '../src/routes/authRoutes.js';

describe('Resilience and Hardening', () => {
    beforeEach(() => {
        loginLimiter.resetKey('::ffff:127.0.0.1');
        loginLimiter.resetKey('127.0.0.1');
    });
    describe('GET /health', () => {
        it('returns 200 OK without DB dependency', async () => {
            const res = await request(app).get('/health');
            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe('UP');
        });
    });

    describe('GET /ready', () => {
        it('returns 200 OK when DB is reachable', async () => {
            const res = await request(app).get('/ready');
            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe('READY');
        });

        it('returns 503 UNAVAILABLE when DB is unreachable', async () => {
            // Mock prisma.$queryRaw to throw an error
            const originalQueryRaw = prisma.$queryRaw;
            prisma.$queryRaw = async () => {
                throw new Error('Connection failed');
            };

            const res = await request(app).get('/ready');
            expect(res.statusCode).toBe(503);
            expect(res.body.status).toBe('UNAVAILABLE');

            // Restore the original method
            prisma.$queryRaw = originalQueryRaw;
        });
    });

    describe('Rate Limiting', () => {
        it('returns 429 when login limit is exceeded', async () => {
            // Test uses limit=3 from env. We fire 4 requests sequentially.
            const limit = parseInt(process.env.RATE_LIMIT_LOGIN_MAX || 3);

            // First 'limit' requests should be processed (returning 401 since account doesn't exist)
            for (let i = 0; i < limit; i++) {
                const res = await request(app)
                    .post('/auth/login')
                    .send({ email: 'test@example.com', password: 'password123' });
                expect(res.statusCode).toBe(401);
            }

            // The limit + 1 request should be rate limited
            const res429 = await request(app)
                .post('/auth/login')
                .send({ email: 'test@example.com', password: 'password123' });
            expect(res429.statusCode).toBe(429);
        });
    });

    describe('Logger Redaction', () => {
        it('redacts sensitive fields recursively', () => {
            // Create a custom memory transport
            const logs = [];
            const memoryTransport = new winston.transports.Console({
                log(info, callback) {
                    logs.push(info);
                    callback();
                }
            });
            logger.add(memoryTransport);

            const payload = {
                req: {
                    body: {
                        password: 'mySecretPassword',
                        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
                        safeField: 'hello'
                    },
                    headers: {
                        authorization: 'Bearer secret_token'
                    }
                }
            };

            logger.info(payload);

            const lastLog = logs[logs.length - 1];
            const logString = JSON.stringify(lastLog);

            expect(logString).toContain('safeField');
            expect(logString).not.toContain('mySecretPassword');
            expect(logString).not.toContain('eyJhbGci');
            expect(logString).not.toContain('secret_token');

            logger.remove(memoryTransport);
        });
    });
});
