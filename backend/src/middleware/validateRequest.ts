import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

// Middleware to validate request body
export const validateBody = (schema: ZodSchema<any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Parse the body, strip unknown fields
            const parsedBody = await schema.parseAsync(req.body);
            // Replace req.body with the parsed/sanitized version
            req.body = parsedBody;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                // Formulate RFC 7807 error
                res.status(422).json({
                    type: 'https://tools.ietf.org/html/rfc7807#section-3.1',
                    title: 'Validation Error',
                    status: 422,
                    detail: 'One or more fields are invalid.',
                    errors: error.issues.map((e) => ({
                        field: e.path.map(String).join('.'),
                        message: e.message,
                    })),
                });
                return;
            }
            next(error);
        }
    };
};

// Middleware to validate request query
export const validateQuery = (schema: ZodSchema<any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsedQuery = await schema.parseAsync(req.query);
            req.query = parsedQuery as unknown as any;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(422).json({
                    type: 'https://tools.ietf.org/html/rfc7807#section-3.1',
                    title: 'Query Validation Error',
                    status: 422,
                    detail: 'One or more query parameters are invalid.',
                    errors: error.issues.map((e) => ({
                        field: e.path.map(String).join('.'),
                        message: e.message,
                    })),
                });
                return;
            }
            next(error);
        }
    };
};

// Middleware to validate request params
export const validateParams = (schema: ZodSchema<any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsedParams = await schema.parseAsync(req.params);
            req.params = parsedParams as unknown as any;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(422).json({
                    type: 'https://tools.ietf.org/html/rfc7807#section-3.1',
                    title: 'Params Validation Error',
                    status: 422,
                    detail: 'One or more URL parameters are invalid.',
                    errors: error.issues.map((e) => ({
                        field: e.path.map(String).join('.'),
                        message: e.message,
                    })),
                });
                return;
            }
            next(error);
        }
    };
};
