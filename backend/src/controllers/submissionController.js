import * as submissionService from '../services/submissionService.js';
import { submitAssignmentSchema } from '../validations/submissionValidation.js';
import { AppError } from '../core/errors.js';

export const submitAssignment = async (req, res, next) => {
    try {
        const { error } = submitAssignmentSchema.validate(req.body);
        if (error) throw new AppError(error.details[0].message, 400, 'VALIDATION_ERROR');

        const { id: assignmentId } = req.params;
        const { content } = req.body;

        const submission = await submissionService.submitAssignment(assignmentId, req.user.id, content);
        res.status(201).json(submission);
    } catch (error) {
        next(error);
    }
};

export const getSubmissions = async (req, res, next) => {
    try {
        const { id: assignmentId } = req.params;
        const submissions = await submissionService.getSubmissionsByAssignment(assignmentId);
        res.json(submissions);
    } catch (error) {
        next(error);
    }
};
