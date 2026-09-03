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

        it('POST /assignments/:id/submit - submitting after due_date is rejected', async () => {
            const token = getToken(fixtures.enrolledStudent);
            
            // Create a past assignment directly in DB
            const pastAssignment = await prisma.assignment.create({
                data: {
                    course_id: fixtures.courseA.id,
                    title: 'Past Assignment',
                    due_date: new Date(Date.now() - 86400000) // 1 day ago
                }
            });

            const res = await request(app)
                .post(`/assignments/${pastAssignment.id}/submit`)
                .set('Authorization', `Bearer ${token}`)
                .send({ content: 'Late submission' });

            expect(res.statusCode).toEqual(400); // 400 Bad Request
        });

        it('POST /courses/:id/assignments - creating assignment with past due_date is rejected', async () => {
            const token = getToken(fixtures.teacherA);
            const course = fixtures.courseA;
            const pastDate = new Date(Date.now() - 86400000).toISOString(); // 1 day ago

            const res = await request(app)
                .post(`/courses/${course.id}/assignments`)
                .set('Authorization', `Bearer ${token}`)
                .send({ title: 'Invalid Assignment', due_date: pastDate });

            expect(res.statusCode).toEqual(400); // 400 Bad Request
        });
    });
});
