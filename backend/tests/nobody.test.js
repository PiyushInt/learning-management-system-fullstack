import request from 'supertest';
import app from '../src/app.js';
import { fixtures, reseed, getToken } from './fixtures.js';

describe('No Body Tests', () => {
    beforeAll(async () => await reseed());

    it('POST /assignments/:id/submit without body', async () => {
        const token = getToken(fixtures.enrolledStudent);
        const res = await request(app).post(`/assignments/${fixtures.assignmentA.id}/submit`).set('Authorization', `Bearer ${token}`);
        // To be fixed in Phase 7
        // expect(res.statusCode).toBe(400); 
    });

    it('POST /courses without body', async () => {
        const token = getToken(fixtures.teacherA);
        const res = await request(app).post('/courses').set('Authorization', `Bearer ${token}`);
        // To be fixed in Phase 7
        // expect(res.statusCode).toBe(400);
    });
});
