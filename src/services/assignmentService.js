import prisma from '../utils/prisma.js';

export const createAssignment = async (courseId, assignmentData) => {
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

export const getAssignmentsByCourse = async (courseId) => {
    return await prisma.assignment.findMany({
        where: { course_id: parseInt(courseId) }
    });
};
