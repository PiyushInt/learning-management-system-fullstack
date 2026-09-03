import Joi from 'joi';
import { AppError } from '../core/errors.js';

export const idParamSchema = Joi.object({
    id: Joi.number().integer().positive().min(1).max(2147483647).required()
});

export const validateParams = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.params);
        if (error) {
            return next(new AppError(`Invalid path parameter: ${error.details[0].message}`, 400, 'VALIDATION_ERROR'));
        }
        
        // Coerce the valid param so controllers don't need to parseInt
        req.params.id = parseInt(req.params.id, 10);
        next();
    };
};
