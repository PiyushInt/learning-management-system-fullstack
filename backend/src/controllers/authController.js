import * as authService from '../services/authService.js';
import { AppError } from '../core/errors.js';

export const register = async (req, res, next) => {
    try {

        const result = await authService.registerUser(req.body);

        res.status(201).json({
            message: 'User registered successfully',
            ...result
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {

        const result = await authService.loginUser(req.body);

        res.json({
            message: 'Login successful',
            ...result
        });
    } catch (error) {
        next(error);
    }
};
