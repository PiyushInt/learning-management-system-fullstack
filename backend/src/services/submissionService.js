import prisma from '../utils/prisma.js';
import { assertOwnsCourse, assertEnrolled } from './courseService.js';
import { AppError } from '../core/errors.js';

export const submitAssignment = async (assignmentId, studentId, content) => {
    // Check if assignment exists
    const assignment = await prisma.assignment.findUnique({
        where: { id: parseInt(assignmentId) }
    });
    if (!assignment) throw new AppError('Assignment not found', 404, 'NOT_FOUND');

    if (assignment.due_date && new Date() > assignment.due_date) {
        throw new AppError('Assignment is past its due date', 400, 'BAD_REQUEST');
    }

    await assertEnrolled(studentId, assignment.course_id);

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

export const getSubmissionsByAssignment = async (assignmentId, teacherId) => {
    const assignment = await prisma.assignment.findUnique({ where: { id: parseInt(assignmentId) } });
    if (!assignment) throw new AppError('Assignment not found', 404, 'NOT_FOUND');
    
    await assertOwnsCourse(teacherId, assignment.course_id);

    return await prisma.submission.findMany({
        where: { assignment_id: parseInt(assignmentId) },
        include: {
            student: { select: { id: true, name: true, email: true } }
        }
    });
};
