import * as assignmentService from '../services/assignmentService.js';
import { createAssignmentSchema } from '../validations/assignmentValidation.js';

export const createAssignment = async (req, res) => {
    try {
        const { error } = createAssignmentSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { id: courseId } = req.params;
        const assignment = await assignmentService.createAssignment(courseId, req.body);
        res.status(201).json(assignment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAssignments = async (req, res) => {
    try {
        const { id: courseId } = req.params;
        const assignments = await assignmentService.getAssignmentsByCourse(courseId);
        res.json(assignments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
