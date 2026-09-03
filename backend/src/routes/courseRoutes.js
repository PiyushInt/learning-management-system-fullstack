import express from 'express';
import { createCourse, getCourses, enrollStudent, getEnrolledCourses, getCourse } from '../controllers/courseController.js';
import { createAssignment, getAssignments } from '../controllers/assignmentController.js';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware.js';

import { validateParams, idParamSchema } from '../middlewares/validateParams.js';

const router = express.Router();

router.get('/enrolled', authenticateToken, authorizeRole('STUDENT'), getEnrolledCourses);
router.get('/', getCourses);
router.get('/:id', validateParams(idParamSchema), getCourse);
router.post('/', authenticateToken, authorizeRole('TEACHER'), createCourse);
router.post('/:id/enroll', validateParams(idParamSchema), authenticateToken, authorizeRole('STUDENT'), enrollStudent);

router.get('/:id/assignments', validateParams(idParamSchema), authenticateToken, getAssignments);
router.post('/:id/assignments', validateParams(idParamSchema), authenticateToken, authorizeRole('TEACHER'), createAssignment);

export default router;
