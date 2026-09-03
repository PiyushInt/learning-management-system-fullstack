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
    });
});
