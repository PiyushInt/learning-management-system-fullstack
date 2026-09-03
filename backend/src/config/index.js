import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const envSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().default(3000),
    DATABASE_URL: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES_IN: Joi.string().default('1d'),
    CORS_ORIGIN: Joi.string(),
    RATE_LIMIT_LOGIN_MAX: Joi.number().default(5),
    RATE_LIMIT_REGISTER_MAX: Joi.number().default(10)
}).unknown(true);

const { error, value: envVars } = envSchema.validate(process.env, { abortEarly: false });

if (error) {
    const missingVars = error.details.map((detail) => detail.message).join('\n');
    throw new Error(`Config validation error(s):\n${missingVars}`);
}

if (envVars.NODE_ENV === 'production') {
    if (Buffer.from(envVars.JWT_SECRET).length < 32) {
        throw new Error('Config validation error(s):\n"JWT_SECRET" must be at least 32 bytes in production');
    }
    if (!envVars.CORS_ORIGIN) {
        throw new Error('Config validation error(s):\n"CORS_ORIGIN" is required in production');
    }
}

export const config = {
    env: envVars.NODE_ENV,
    port: envVars.PORT,
    dbUrl: envVars.DATABASE_URL,
    corsOrigin: envVars.CORS_ORIGIN,
    jwt: {
        secret: envVars.JWT_SECRET,
        expiresIn: envVars.JWT_EXPIRES_IN
    },
    rateLimit: {
        loginMax: envVars.RATE_LIMIT_LOGIN_MAX,
        registerMax: envVars.RATE_LIMIT_REGISTER_MAX
    }
};
