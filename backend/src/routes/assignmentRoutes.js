import express from 'express';
import { submitAssignment, getSubmissions } from '../controllers/submissionController.js';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/:id/submit', authenticateToken, authorizeRole('STUDENT'), submitAssignment);
router.get('/:id/submissions', authenticateToken, authorizeRole('TEACHER'), getSubmissions);

export default router;
