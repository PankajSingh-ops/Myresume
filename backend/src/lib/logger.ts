import winston from 'winston';
import 'winston-daily-rotate-file';

// Ensure structured formatting with strict PII removal
const redactPII = winston.format((info) => {
    // Top-level key filtering list
    const sensitiveKeys = [
        'password', 'password_hash', 'token', 'access_token',
        'refresh_token', 'authorization', 'cookie', 'credit_card'
    ];

    const filterObj = (obj: any): any => {
        if (!obj || typeof obj !== 'object') return obj;
        if (Array.isArray(obj)) return obj.map(filterObj);

        const newObj: any = {};
        for (const [key, value] of Object.entries(obj)) {
            if (sensitiveKeys.includes(key.toLowerCase())) {
                newObj[key] = '[REDACTED]';
            } else if (typeof value === 'object') {
                newObj[key] = filterObj(value);
            } else {
                newObj[key] = value;
            }
        }
        return newObj;
    };

    // Filter metadata if passed
    if (info.metadata) {
        info.metadata = filterObj(info.metadata);
    }

    // Catch-all stringification sanitize
    for (const key of Object.keys(info)) {
        if (sensitiveKeys.includes(key.toLowerCase())) {
            info[key] = '[REDACTED]';
        }
    }

    return info;
});

const baseFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    redactPII(),
    winston.format.json()
);

// Instantiate standard transports
const transports = [];

// File Transport: General application logs
transports.push(
    new winston.transports.DailyRotateFile({
        dirname: 'logs',
        filename: 'app-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '30d',
        format: baseFormat,
    })
);

// File Transport: Error logs only
transports.push(
    new winston.transports.DailyRotateFile({
        level: 'error',
        dirname: 'logs',
        filename: 'error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '90d',
        format: baseFormat,
    })
);

// Console Transport for DEV environments
if (process.env.NODE_ENV !== 'production') {
    transports.push(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(
                    (info) => `[${info.timestamp}] ${info.level}: ${info.message} ${info.metadata && Object.keys(info.metadata).length ? JSON.stringify(info.metadata) : ''
                        }`
                )
            ),
        })
    );
}

// ----------------------------------------
// Export the main application logger
// ----------------------------------------
export const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transports,
});

// ----------------------------------------
// Dedicated Audit Logger wrapper
// ----------------------------------------

const auditLogger = winston.createLogger({
    level: 'info',
    format: baseFormat,
    transports: [
        new winston.transports.DailyRotateFile({
            dirname: 'logs',
            filename: 'audit-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m', // Keep audit trails separate
            maxFiles: '365d', // Keeping audits longer could be a security best practice
        })
    ]
});

// Dedicated function for strict security event formatting
export const auditLog = (event: string, userId: string | null, metadata: any = {}) => {
    auditLogger.info(event, { userId, metadata });
};
