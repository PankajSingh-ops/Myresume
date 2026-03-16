import { Request, Response } from 'express';

// Catch-all 404 handler for unmatched routes
export const notFoundHandler = (req: Request, res: Response) => {
    res.status(404).json({
        type: 'https://tools.ietf.org/html/rfc7807#section-3.1',
        title: 'Not Found',
        status: 404,
        detail: `The requested resource '${req.originalUrl}' was not found on this server.`,
    });
};
