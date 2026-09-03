import winston from 'winston';

const { combine, timestamp, printf, json, colorize } = winston.format;



// Recursive redaction for sensitive fields
const redactFields = ['password', 'token', 'authorization'];

const redactObj = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) {
        return obj.map((item) => redactObj(item));
    }
    const redacted = { ...obj };
    for (const key in redacted) {
        if (redactFields.includes(key.toLowerCase())) {
            redacted[key] = '[REDACTED]';
        } else if (typeof redacted[key] === 'object') {
            redacted[key] = redactObj(redacted[key]);
        }
    }
    return redacted;
};

const redactFormat = winston.format((info) => {
    return redactObj(info);
});

const customFormat = printf(({ level, message, timestamp, reqId, ...meta }) => {
    const id = reqId ? `[${reqId}] ` : '';
    const metaString = Object.keys(meta).length ? JSON.stringify(meta) : '';
    return `${timestamp} ${level}: ${id}${message} ${metaString}`;
});

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        redactFormat(),
        process.env.NODE_ENV === 'production' ? json() : combine(colorize(), customFormat)
    ),
    transports: [new winston.transports.Console()]
});

export default logger;
