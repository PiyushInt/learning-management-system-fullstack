import * as authService from '../services/authService.js';
import { registerSchema, loginSchema } from '../validations/authValidation.js';

export const register = async (req, res) => {
    try {
        const { error } = registerSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const result = await authService.registerUser(req.body);

        res.status(201).json({
            message: 'User registered successfully',
            ...result
        });
    } catch (error) {
        const status = error.message === 'Email already in use.' ? 400 : 500;
        res.status(status).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { error } = loginSchema.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const result = await authService.loginUser(req.body);

        res.json({
            message: 'Login successful',
            ...result
        });
    } catch (error) {
        const status = error.message === 'Invalid email or password.' ? 401 : 500;
        res.status(status).json({ error: error.message });
    }
};
