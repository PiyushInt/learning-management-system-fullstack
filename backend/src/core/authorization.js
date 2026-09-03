import prisma from '../utils/prisma.js';
import { AppError } from './errors.js';

export const assertOwnsCourse = async (userId, courseId) => {
    const course = await prisma.course.findUnique({ where: { id: parseInt(courseId) } });
    if (!course) throw new AppError('Course not found', 404, 'NOT_FOUND');
    if (course.teacher_id !== userId) {
        throw new AppError('Access denied: You do not own this course', 403, 'FORBIDDEN');
    }
    return course;
};

export const assertEnrolled = async (studentId, courseId) => {
    const course = await prisma.course.findUnique({ where: { id: parseInt(courseId) } });
    if (!course) throw new AppError('Course not found', 404, 'NOT_FOUND');

    const enrollment = await prisma.enrollment.findUnique({
        where: {
            student_id_course_id: { student_id: studentId, course_id: parseInt(courseId) }
        }
    });
    if (!enrollment) {
        throw new AppError('Access denied: You are not enrolled in this course', 403, 'FORBIDDEN');
    }
    return enrollment;
};
