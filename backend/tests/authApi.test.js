import request from 'supertest';
import app from '../src/app.js';
import prisma from '../src/utils/prisma.js';
import { reseed, truncateDb } from './fixtures.js';

describe('Auth API', () => {
    beforeEach(async () => {
        await reseed();
    });

    afterAll(async () => {
        await truncateDb();
        await prisma.$disconnect();
    });

    describe('POST /auth/register', () => {
        it('should register a user', async () => {
            const res = await request(app).post('/auth/register').send({
                name: 'Integration User',
                email: 'integration@test.com',
                password: 'password123',
                role: 'TEACHER'
            });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('token');
        });

        it('should return 409 for duplicate email', async () => {
            const res = await request(app).post('/auth/register').send({
                name: 'Teacher A Clone',
                email: 'ta@test.com', // This email is seeded in fixtures
                password: 'password123',
                role: 'TEACHER'
            });

            expect(res.statusCode).toEqual(409);
            expect(res.body.error).toHaveProperty('code', 'EMAIL_ALREADY_EXISTS');
        });
    });
});
