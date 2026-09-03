export const validateBody = (schema) => {
    return (req, res, next) => {
        // If there is no body and the schema expects an object, Joi will handle it (or we can pass {} if req.body is undefined, but express.json() gives {} usually).
        // It's safer to pass req.body or {}
        const payload = req.body || {};
        const { error } = schema.validate(payload);
        if (error) {
            return res.status(400).json({
                error: 'VALIDATION_ERROR',
                message: error.details[0].message
            });
        }
        next();
    };
};
