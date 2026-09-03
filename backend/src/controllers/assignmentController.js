import * as assignmentService from '../services/assignmentService.js';
import { createAssignmentSchema } from '../validations/assignmentValidation.js';
import { AppError } from '../core/errors.js';

export const createAssignment = async (req, res, next) => {
    try {
        const { error } = createAssignmentSchema.validate(req.body);
        if (error) throw new AppError(error.details[0].message, 400, 'VALIDATION_ERROR');

        const { id: courseId } = req.params;
        const assignment = await assignmentService.createAssignment(courseId, req.body);
        res.status(201).json(assignment);
    } catch (error) {
        next(error);
    }
};

export const getAssignments = async (req, res, next) => {
    try {
        const { id: courseId } = req.params;
        const assignments = await assignmentService.getAssignmentsByCourse(courseId);
        res.json(assignments);
    } catch (error) {
        next(error);
    }
};
