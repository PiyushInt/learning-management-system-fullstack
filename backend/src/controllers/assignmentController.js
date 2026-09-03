import * as assignmentService from '../services/assignmentService.js';


export const createAssignment = async (req, res, next) => {
    try {
        const { id: courseId } = req.params;
        const assignment = await assignmentService.createAssignment(courseId, req.body, req.user.id);
        res.status(201).json(assignment);
    } catch (error) {
        next(error);
    }
};

export const getAssignments = async (req, res, next) => {
    try {
        const { id: courseId } = req.params;
        const assignments = await assignmentService.getAssignmentsByCourse(courseId, req.user);
        res.json(assignments);
    } catch (error) {
        next(error);
    }
};
