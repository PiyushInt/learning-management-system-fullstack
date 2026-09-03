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
            expect(res.body.error).toHaveProperty('code', 'UNAUTHORIZED');
        });
    });

    describe('GET /courses', () => {
        it('GET /courses - should return list of courses (public)', async () => {
            const res = await request(app).get('/courses');
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            
            // Should not expose teacher email
            if (res.body.length > 0) {
                expect(res.body[0].teacher.email).toBeUndefined();
            }
        });

        it('GET /courses?limit=99999 - should clamp limit to 100', async () => {
            // We just ensure it doesn't crash and returns 200. We don't have 100 courses in fixtures,
            // but the test checks the server-side clamp logic doesn't fail.
            const res = await request(app).get('/courses?limit=99999');
            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeLessThanOrEqual(100);
        });
    });

    describe('GET /courses/:id/assignments', () => {
        it('should return 401 if no token is provided', async () => {
            const courseId = 1; // Use valid ID so validation passes and auth is tested
            const res = await request(app)
                .get(`/courses/${courseId}/assignments`);

            expect(res.statusCode).toEqual(401);
            expect(res.body.error).toHaveProperty('code', 'UNAUTHORIZED');
        });
    });

    describe('Authorization Matrix', () => {
        it('POST /courses/:id/assignments - teacherB creating in teacherA course', async () => {
            const token = getToken(fixtures.teacherB);
            const course = fixtures.courseA;
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 1);
            const res = await request(app)
                .post(`/courses/${course.id}/assignments`)
                .set('Authorization', `Bearer ${token}`)
                .send({ title: 'Hacked', description: 'Hacked', due_date: futureDate.toISOString() });
            expect(res.statusCode).toEqual(403);
        });

        it('POST /courses/:id/enroll - student enrolling a DIFFERENT student', async () => {
            const token = getToken(fixtures.unenrolledStudent);
            const course = fixtures.courseA;
            const res = await request(app)
                .post(`/courses/${course.id}/enroll`)
                .set('Authorization', `Bearer ${token}`)
                .send({ student_id: fixtures.enrolledStudent.id }); 
            expect(res.statusCode).toEqual(403);
        });

        it('GET /courses/:id/assignments - student not enrolled in that course', async () => {
            const token = getToken(fixtures.unenrolledStudent);
            const course = fixtures.courseA;
            const res = await request(app)
                .get(`/courses/${course.id}/assignments`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(403);
        });

        it('GET /courses/:id/assignments - teacherA reading assignments for courseA', async () => {
            const token = getToken(fixtures.teacherA);
            const course = fixtures.courseA;
            const res = await request(app)
                .get(`/courses/${course.id}/assignments`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(200);
        });
        it('POST /courses/:id/enroll - enrolledStudent double-enrolling produces exactly one 201 and one 409', async () => {
            const token = getToken(fixtures.enrolledStudent);
            const course = fixtures.courseB;

            const req1 = request(app)
                .post(`/courses/${course.id}/enroll`)
                .set('Authorization', `Bearer ${token}`);
                
            const req2 = request(app)
                .post(`/courses/${course.id}/enroll`)
                .set('Authorization', `Bearer ${token}`);
                
            const [res1, res2] = await Promise.all([req1, req2]);
            const statuses = [res1.statusCode, res2.statusCode].sort();
            
            expect(statuses).toEqual([201, 409]);
        });

        it('POST /courses/:id/enroll - teacher cannot enroll as student', async () => {
            const token = getToken(fixtures.teacherB);
            const course = fixtures.courseA;
            const res = await request(app)
                .post(`/courses/${course.id}/enroll`)
                .set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toEqual(403);
        });
    });
});
