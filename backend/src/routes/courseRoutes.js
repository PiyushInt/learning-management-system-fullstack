import express from 'express';
import { createCourse, getCourses, enrollStudent, getEnrolledCourses, getCourse } from '../controllers/courseController.js';
import { createAssignment, getAssignments } from '../controllers/assignmentController.js';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/enrolled', authenticateToken, authorizeRole('STUDENT'), getEnrolledCourses);
router.get('/', getCourses);
router.get('/:id', getCourse);
router.post('/', authenticateToken, authorizeRole('TEACHER'), createCourse);
router.post('/:id/enroll', authenticateToken, authorizeRole('STUDENT'), enrollStudent);

router.get('/:id/assignments', getAssignments);
router.post('/:id/assignments', authenticateToken, authorizeRole('TEACHER'), createAssignment);

export default router;
