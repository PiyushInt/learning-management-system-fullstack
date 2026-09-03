import request from 'supertest';
import app from '../src/app.js';
import prisma from '../src/utils/prisma.js';
import { reseed, truncateDb, fixtures, getToken } from './fixtures.js';

describe('Course API', () => {
    beforeEach(async () => {
        await reseed();
    });

    afterAll(async () => {
        await truncateDb();
        await prisma.$disconnect();
    });

    describe('GET /courses/enrolled', () => {
        it('should return 200 and the enrolled courses for an authenticated student', async () => {
            const token = getToken(fixtures.enrolledStudent);

            const res = await request(app)
                .get('/courses/enrolled')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(1);
            expect(res.body[0].title).toBe('Course A');
        });
        
        it('should return 401 if no token is provided', async () => {
            const res = await request(app)
                .get('/courses/enrolled');

            expect(res.statusCode).toEqual(401);
            expect(res.body.error).toHaveProperty('message', 'Access Denied: No Token Provided!');
        });
    });
});
