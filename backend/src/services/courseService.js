import prisma from '../utils/prisma.js';

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

export const getCourses = async () => {
    return await prisma.course.findMany({
        include: {
            teacher: {
                select: { name: true, email: true }
            }
        }
    });
};

export const getCourseById = async (id) => {
    return await prisma.course.findUnique({
        where: { id: parseInt(id) },
        include: {
            teacher: {
                select: { name: true, email: true }
            }
        }
    });
};

export const getEnrolledCourses = async (studentId) => {
    return await prisma.course.findMany({
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
        throw new Error('Student already enrolled in this course.');
    }

    return await prisma.enrollment.create({
        data: {
            student_id: studentId,
            course_id: parseInt(courseId)
        }
    });
};
