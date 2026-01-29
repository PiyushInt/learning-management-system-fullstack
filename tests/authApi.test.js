import request from 'supertest';
import app from '../src/app.js';
import prisma from '../src/utils/prisma.js';

// Note: These tests require a running database.
// In a real CI environment, you would spin up a test DB or use a docker container.

describe('Auth API', () => {
    // Skipping actual DB interaction in this environment
    // Remove .skip to run with a real DB

    describe('POST /auth/register', () => {
        it.skip('should register a user', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send({
                    name: 'Integration User',
                    email: 'integration@test.com',
                    password: 'password123',
                    role: 'TEACHER'
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('token');
        });
    });
});
