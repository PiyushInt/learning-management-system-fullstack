import prisma from '../src/utils/prisma.js';

describe('Cascade Behaviors', () => {
    beforeAll(async () => {
        await prisma.submission.deleteMany({});
        await prisma.assignment.deleteMany({});
        await prisma.enrollment.deleteMany({});
        await prisma.course.deleteMany({});
        await prisma.user.deleteMany({});
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('Deleting a course hard-deletes assignments and submissions', async () => {
        // Create teacher and student
        const teacher = await prisma.user.create({
            data: { name: 'Teacher', email: 'teacher@test.com', password_hash: 'pass', role: 'TEACHER' }
        });
        const student = await prisma.user.create({
            data: { name: 'Student', email: 'student@test.com', password_hash: 'pass', role: 'STUDENT' }
        });

        // Create course
        const course = await prisma.course.create({
            data: { title: 'Cascade Course', teacher_id: teacher.id }
        });

        // Create assignment
        const assignment = await prisma.assignment.create({
            data: { title: 'A1', due_date: new Date(Date.now() + 86400000), course_id: course.id }
        });

        // Create submission
        await prisma.submission.create({
            data: { content: 'My work', assignment_id: assignment.id, student_id: student.id }
        });

        // Delete course
        await prisma.course.delete({ where: { id: course.id } });

        // Assert submissions are gone
        const submissions = await prisma.submission.findMany({});
        expect(submissions.length).toBe(0);
        
        // Assert assignment is gone
        const assignments = await prisma.assignment.findMany({});
        expect(assignments.length).toBe(0);
    });
});
