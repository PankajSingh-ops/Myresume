import { Request, Response, NextFunction } from 'express';

const isPlainObject = (obj: any): boolean => {
    return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
};

const sanitizeValue = (value: any): any => {
    if (typeof value === 'string') {
        // Trim and remove null bytes
        return value.trim().replace(/\0/g, '');
    }

    if (Array.isArray(value)) {
        return value.map(sanitizeValue);
    }

    if (isPlainObject(value)) {
        const sanitizedObj: any = {};
        for (const key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
                // Prevent prototype pollution
                if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
                    continue;
                }
                sanitizedObj[key] = sanitizeValue(value[key]);
            }
        }
        return sanitizedObj;
    }

    return value;
};

// Middleware to sanitize request body, query, and params deep
export const sanitize = (req: Request, res: Response, next: NextFunction) => {
    if (req.body) req.body = sanitizeValue(req.body);
    if (req.query) req.query = sanitizeValue(req.query);
    if (req.params) req.params = sanitizeValue(req.params);
    next();
};
