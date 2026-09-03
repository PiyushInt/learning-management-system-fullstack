import prisma from '../utils/prisma.js';
import { assertOwnsCourse, assertEnrolled } from '../core/authorization.js';
import { AppError } from '../core/errors.js';

export const createAssignment = async (courseId, assignmentData, teacherId) => {
    await assertOwnsCourse(teacherId, courseId);

    const { title, description, due_date } = assignmentData;
    return await prisma.assignment.create({
        data: {
            course_id: parseInt(courseId),
            title,
            description,
            due_date: new Date(due_date)
        }
    });
};

export const getAssignmentsByCourse = async (courseId, user) => {
    if (user.role === 'TEACHER') {
        await assertOwnsCourse(user.id, courseId);
    } else if (user.role === 'STUDENT') {
        await assertEnrolled(user.id, courseId);
    } else {
        throw new AppError('Invalid role', 403, 'FORBIDDEN');
    }

    return await prisma.assignment.findMany({
        where: { course_id: parseInt(courseId) }
    });
};
