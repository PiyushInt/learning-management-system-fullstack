import { config } from '../config/index.js';

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const isDevelopment = config.env === 'development';
    
    // Log unexpected errors fully in production, and all errors fully in development
    if (isDevelopment) {
        console.error(err.stack);
    } else if (!err.isOperational) {
        console.error(`[UNEXPECTED ERROR - ${req.id}]`, err.stack);
    }

    res.status(statusCode).json({
        error: {
            message: err.isOperational ? err.message : 'Internal Server Error',
            code: err.isOperational ? (err.code || 'INTERNAL_ERROR') : 'INTERNAL_ERROR',
            requestId: req.id,
            ...(isDevelopment && { stack: err.stack })
        }
    });
};
