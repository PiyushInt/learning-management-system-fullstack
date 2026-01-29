import Joi from 'joi';

export const createCourseSchema = Joi.object({
    title: Joi.string().min(3).required(),
    description: Joi.string().optional()
});

export const enrollSchema = Joi.object({
    // No body params needed strictly if using clean URLs, but maybe useful later
});
