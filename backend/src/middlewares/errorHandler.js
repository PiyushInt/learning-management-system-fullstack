import { config } from '../config/index.js';

export const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    const isDevelopment = config.env === 'development';
    
    // Map Prisma unique constraint violations to 409 Conflict
    if (err.code === 'P2002') {
        statusCode = 409;
        err.isOperational = true;
        err.message = 'Resource already exists';
        err.code = 'CONFLICT';
    }
    
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
