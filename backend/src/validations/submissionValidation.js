import Joi from 'joi';

export const submitAssignmentSchema = Joi.object({
    content: Joi.string().required()
});
