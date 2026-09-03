import prisma from '../utils/prisma.js';
import { AppError } from '../core/errors.js';

export const createCourse = async (courseData, teacherId) => {
    const { title, description } = courseData;
    return await prisma.course.create({
        data: {
            title,
            description,
            teacher_id: teacherId
        }
    });
};

export const getCourses = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    return await prisma.course.findMany({
        skip,
        take: limit,
        include: {
            teacher: {
                select: { name: true }
            }
        }
    });
};

export const getCourseById = async (id) => {
    return await prisma.course.findUnique({
        where: { id: parseInt(id) },
        include: {
            teacher: {
                select: { name: true }
            }
        }
    });
};

export const getEnrolledCourses = async (studentId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    return await prisma.course.findMany({
        skip,
        take: limit,
        where: {
            enrollments: {
                some: {
                    student_id: studentId
                }
            }
        },
        include: {
            teacher: {
                select: { name: true, email: true }
            }
        }
    });
};

export const enrollStudent = async (courseId, studentId) => {
    const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
            student_id_course_id: {
                student_id: studentId,
                course_id: parseInt(courseId)
            }
        }
    });

    if (existingEnrollment) {
        throw new AppError('Student already enrolled in this course.', 409, 'STUDENT_ALREADY_ENROLLED');
    }

    return await prisma.enrollment.create({
        data: {
            student_id: studentId,
            course_id: parseInt(courseId)
        }
    });
};

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
