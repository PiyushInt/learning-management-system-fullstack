import request from 'supertest';
import app from '../src/app.js';
import prisma from '../src/utils/prisma.js';
import { reseed, truncateDb, fixtures, getToken } from './fixtures.js';

describe('Assignment API', () => {
    beforeEach(async () => {
        await reseed();
    });

    afterAll(async () => {
        await truncateDb();
        await prisma.$disconnect();
    });

    describe('Authorization Matrix', () => {
        it('GET /assignments/:id/submissions - teacherB reading teacherA course', async () => {
            const token = getToken(fixtures.teacherB);
            const assignment = fixtures.assignmentA;
            const res = await request(app)
                .get(`/assignments/${assignment.id}/submissions`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(403);
        });

        it('POST /assignments/:id/submit - unenrolledStudent submitting', async () => {
            const token = getToken(fixtures.unenrolledStudent);
            const assignment = fixtures.assignmentA;
            const res = await request(app)
                .post(`/assignments/${assignment.id}/submit`)
                .set('Authorization', `Bearer ${token}`)
                .send({ content: 'I should not be able to do this' });
            expect(res.statusCode).toEqual(403);
        });

        it('POST /assignments/:id/submit - enrolledStudent submitting to DIFFERENT course assignment', async () => {
            const token = getToken(fixtures.enrolledStudent); // Enrolled in courseA
            const assignment = fixtures.assignmentB; // Belongs to courseB
            const res = await request(app)
                .post(`/assignments/${assignment.id}/submit`)
                .set('Authorization', `Bearer ${token}`)
                .send({ content: 'I am enrolled, but not here' });
            expect(res.statusCode).toEqual(403);
        });

        it('POST /assignments/:id/submit - enrolledStudent double-submitting produces exactly one 201 and one 409', async () => {
            const token = getToken(fixtures.enrolledStudent);
            const assignment = fixtures.assignmentA;
            
            // Fire both requests concurrently
            const req1 = request(app)
                .post(`/assignments/${assignment.id}/submit`)
                .set('Authorization', `Bearer ${token}`)
                .send({ content: 'Concurrent submission A' });
            
            const req2 = request(app)
                .post(`/assignments/${assignment.id}/submit`)
                .set('Authorization', `Bearer ${token}`)
                .send({ content: 'Concurrent submission B' });
                
            const [res1, res2] = await Promise.all([req1, req2]);
            
            const statuses = [res1.statusCode, res2.statusCode].sort();
            
            // One should succeed, one should fail with 409
            expect(statuses).toEqual([201, 409]);
        });
    });
});
