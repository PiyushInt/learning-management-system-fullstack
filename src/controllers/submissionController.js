import * as submissionService from '../services/submissionService.js';
import { submitAssignmentSchema } from '../validations/submissionValidation.js';

export const submitAssignment = async (req, res) => {
    try {
        const { error } = submitAssignmentSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { id: assignmentId } = req.params;
        const { content } = req.body;

        const submission = await submissionService.submitAssignment(assignmentId, req.user.id, content);
        res.status(201).json(submission);
    } catch (error) {
        const status = error.message === 'Assignment already submitted' || error.message === 'Assignment not found' ? 400 : 500;
        res.status(status).json({ error: error.message });
    }
};

export const getSubmissions = async (req, res) => {
    try {
        const { id: assignmentId } = req.params;
        const submissions = await submissionService.getSubmissionsByAssignment(assignmentId);
        res.json(submissions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
