import request from 'supertest';
import app from '../src/app.js';
import { fixtures, reseed, getToken } from './fixtures.js';

describe('No Body Tests', () => {
    beforeAll(async () => await reseed());

    it('[Phase 7] POST /assignments/:id/submit with no body returns 400', async () => {
        const token = getToken(fixtures.enrolledStudent);
        const res = await request(app)
            .post(`/assignments/${fixtures.assignmentA.id}/submit`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(400);
    });

    it('[Phase 7] POST /courses with no body returns 400', async () => {
        const token = getToken(fixtures.teacherA);
        const res = await request(app).post('/courses').set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(400);
    });
});
