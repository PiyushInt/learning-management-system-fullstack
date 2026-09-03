import express from 'express';
import { submitAssignment, getSubmissions } from '../controllers/submissionController.js';
import { authenticateToken, authorizeRole } from '../middlewares/authMiddleware.js';

import { validateParams, idParamSchema } from '../middlewares/validateParams.js';

const router = express.Router();

router.post('/:id/submit', validateParams(idParamSchema), authenticateToken, authorizeRole('STUDENT'), submitAssignment);
router.get('/:id/submissions', validateParams(idParamSchema), authenticateToken, authorizeRole('TEACHER'), getSubmissions);

export default router;
