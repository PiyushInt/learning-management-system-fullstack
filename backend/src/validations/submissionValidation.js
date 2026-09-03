import Joi from 'joi';

export const submitAssignmentSchema = Joi.object({
    content: Joi.string().required()
}).options({ stripUnknown: false, allowUnknown: false });
