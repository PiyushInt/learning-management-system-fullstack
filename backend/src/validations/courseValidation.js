import Joi from 'joi';

export const createCourseSchema = Joi.object({
    title: Joi.string().min(3).required(),
    description: Joi.string().optional()
}).options({ stripUnknown: false, allowUnknown: false });

export const enrollSchema = Joi.object({}).options({ stripUnknown: false, allowUnknown: false });
