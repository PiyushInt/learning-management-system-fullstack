import express from 'express';
import { register, login } from '../controllers/authController.js';

import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../validations/authValidation.js';

import rateLimit from 'express-rate-limit';
import { config } from '../config/index.js';

const router = express.Router();

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: config.rateLimit.loginMax,
    message: { error: 'TOO_MANY_REQUESTS', message: 'Too many login attempts, please try again after 15 minutes' }
});

export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: config.rateLimit.registerMax,
    message: {
        error: 'TOO_MANY_REQUESTS',
        message: 'Too many accounts created from this IP, please try again after an hour'
    }
});

router.post('/register', registerLimiter, validateBody(registerSchema), register);
router.post('/login', loginLimiter, validateBody(loginSchema), login);

export default router;
