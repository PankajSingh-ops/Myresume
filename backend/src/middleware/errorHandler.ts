import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { InsufficientCreditsError, AppError } from '../modules/credits/errors';
import { logger } from './requestLogger';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const isProduction = process.env.NODE_ENV === 'production';
    const requestId = req.id || 'unknown';
    const userId = (req as any).user?.id;

    // Log the full error to Winston
    const logInfo = {
        message: err.message,
        stack: err.stack,
        requestId,
        userId,
        path: req.path,
        method: req.method,
    };

    logger.error(logInfo);

    // Default error payload
    const errorResponse: any = {
        type: 'https://tools.ietf.org/html/rfc7807#section-6.6',
        title: 'Internal Server Error',
        status: 500,
        detail: 'An unexpected error occurred.',
        instance: req.path,
        requestId: req.id || undefined,
    };

    if (!isProduction) {
        errorResponse.stack = err.stack;
    }

    // Insufficient Credits
    if (err instanceof InsufficientCreditsError || err.code === 'INSUFFICIENT_CREDITS') {
        errorResponse.status = 402;
        errorResponse.title = 'Payment Required';
        errorResponse.detail = err.message;
        errorResponse.balance = err.balance;
        errorResponse.required = err.required;
        errorResponse.code = 'INSUFFICIENT_CREDITS';
    }
    // Zod Errors
    else if (err instanceof ZodError) {
        errorResponse.status = 422;
        errorResponse.title = 'Unprocessable Entity';
        errorResponse.detail = 'Validation failed.';
        errorResponse.errors = (err as any).errors.map((e: any) => ({ field: e.path.join('.'), message: e.message }));
    }
    // JWT Errors
    else if (err instanceof TokenExpiredError) {
        errorResponse.status = 401;
        errorResponse.title = 'Unauthorized';
        errorResponse.code = 'TOKEN_EXPIRED';
        errorResponse.detail = 'Your access token has expired. Please log in again.';
    }
    else if (err instanceof JsonWebTokenError) {
        errorResponse.status = 401;
        errorResponse.title = 'Unauthorized';
        errorResponse.code = 'INVALID_TOKEN';
        errorResponse.detail = 'The provided token is invalid.';
    }
    // Postgres Errors
    else if (err.code === '23505') { // Unique violation
        errorResponse.status = 409;
        errorResponse.title = 'Conflict';
        errorResponse.detail = 'A resource with this identifier already exists.';
        errorResponse.code = 'DUPLICATE_RESOURCE';
    }
    else if (err.code === '23503') { // Foreign key
        errorResponse.status = 400;
        errorResponse.title = 'Bad Request';
        errorResponse.detail = 'A referenced resource does not exist.';
        errorResponse.code = 'INVALID_REFERENCE';
    }
    // Multer Errors
    else if (err.name === 'MulterError') {
        errorResponse.status = 400;
        errorResponse.title = 'Bad Request';
        errorResponse.detail = err.message;
        errorResponse.code = 'UPLOAD_ERROR';
    }
    // Custom AppError
    else if (err instanceof AppError) {
        errorResponse.status = err.statusCode;
        errorResponse.title = err.name || 'Error';
        errorResponse.detail = err.message;
        errorResponse.code = err.code;
    }
    // Custom Status Code from error object
    else if (err.statusCode && typeof err.statusCode === 'number') {
        errorResponse.status = err.statusCode;
        errorResponse.detail = err.message;
    }

    // Update type based on HTTP status
    errorResponse.type = `https://tools.ietf.org/html/rfc7807#section-${errorResponse.status}`;

    res.status(errorResponse.status).json(errorResponse);
};
