import prisma from '../src/utils/prisma.js';
import { signToken } from '../src/utils/auth.js';
import { loginLimiter, registerLimiter } from '../src/routes/authRoutes.js';

export const fixtures = {};

export const truncateDb = async () => {
    await prisma.$transaction([
        prisma.submission.deleteMany(),
        prisma.assignment.deleteMany(),
        prisma.enrollment.deleteMany(),
        prisma.course.deleteMany(),
        prisma.user.deleteMany()
    ]);
};

export const reseed = async () => {
    // Reset rate limiters for test IPs
    loginLimiter.resetKey('::ffff:127.0.0.1');
    loginLimiter.resetKey('127.0.0.1');
    registerLimiter.resetKey('::ffff:127.0.0.1');
    registerLimiter.resetKey('127.0.0.1');

    await truncateDb();

    // Create users
    fixtures.teacherA = await prisma.user.create({
        data: { name: 'Teacher A', email: 'ta@test.com', password_hash: 'hashed', role: 'TEACHER' }
    });
    fixtures.teacherB = await prisma.user.create({
        data: { name: 'Teacher B', email: 'tb@test.com', password_hash: 'hashed', role: 'TEACHER' }
    });
    fixtures.enrolledStudent = await prisma.user.create({
        data: { name: 'Student 1', email: 's1@test.com', password_hash: 'hashed', role: 'STUDENT' }
    });
    fixtures.unenrolledStudent = await prisma.user.create({
        data: { name: 'Student 2', email: 's2@test.com', password_hash: 'hashed', role: 'STUDENT' }
    });

    // Create courses
    fixtures.courseA = await prisma.course.create({ data: { title: 'Course A', teacher_id: fixtures.teacherA.id } });
    fixtures.courseB = await prisma.course.create({ data: { title: 'Course B', teacher_id: fixtures.teacherB.id } });

    // Create assignments
    fixtures.assignmentA = await prisma.assignment.create({
        data: { course_id: fixtures.courseA.id, title: 'Asg A', due_date: new Date(Date.now() + 86400000) }
    });
    fixtures.assignmentB = await prisma.assignment.create({
        data: { course_id: fixtures.courseB.id, title: 'Asg B', due_date: new Date(Date.now() + 86400000) }
    });

    // Create enrollment
    await prisma.enrollment.create({
        data: { student_id: fixtures.enrolledStudent.id, course_id: fixtures.courseA.id }
    });
};

export const getToken = (user) => {
    return signToken({ id: user.id, role: user.role });
};
