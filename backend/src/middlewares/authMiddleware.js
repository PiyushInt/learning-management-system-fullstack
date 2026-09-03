import { verifyToken } from '../utils/auth.js';
import { AppError } from '../core/errors.js';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return next(new AppError('Access Denied: No Token Provided!', 401, 'UNAUTHORIZED'));
    }

    try {
        const user = verifyToken(token);
        req.user = user;
        next();
    } catch (error) {
        return next(new AppError('Invalid token.', 403, 'FORBIDDEN'));
    }
};

export const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError('Access denied. Insufficient permissions.', 403, 'FORBIDDEN'));
        }
        next();
    };
};

