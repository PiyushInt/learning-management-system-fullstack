import Joi from 'joi';

export const createAssignmentSchema = Joi.object({
    title: Joi.string().min(3).required(),
    description: Joi.string().optional(),
    due_date: Joi.date().iso().required().greater('now')
});
