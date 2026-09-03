import prisma from '../utils/prisma.js';
import { AppError } from '../core/errors.js';

export const submitAssignment = async (assignmentId, studentId, content) => {
    // Check if assignment exists
    const assignment = await prisma.assignment.findUnique({
        where: { id: parseInt(assignmentId) }
    });
    if (!assignment) throw new AppError('Assignment not found', 404, 'NOT_FOUND');

    // Check if already submitted
    const existingSubmission = await prisma.submission.findFirst({
        where: {
            assignment_id: parseInt(assignmentId),
            student_id: studentId
        }
    });
    if (existingSubmission) throw new AppError('Assignment already submitted', 409, 'CONFLICT');

    return await prisma.submission.create({
        data: {
            assignment_id: parseInt(assignmentId),
            student_id: studentId,
            content,
            status: 'SUBMITTED'
        }
    });
};

export const getSubmissionsByAssignment = async (assignmentId) => {
    return await prisma.submission.findMany({
        where: { assignment_id: parseInt(assignmentId) },
        include: {
            student: { select: { id: true, name: true, email: true } }
        }
    });
};
