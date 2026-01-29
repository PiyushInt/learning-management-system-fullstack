import prisma from '../utils/prisma.js';

export const submitAssignment = async (assignmentId, studentId, content) => {
    // Check if assignment exists
    const assignment = await prisma.assignment.findUnique({
        where: { id: parseInt(assignmentId) }
    });
    if (!assignment) throw new Error('Assignment not found');

    // Check if already submitted
    const existingSubmission = await prisma.submission.findFirst({
        where: {
            assignment_id: parseInt(assignmentId),
            student_id: studentId
        }
    });
    if (existingSubmission) throw new Error('Assignment already submitted');

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
