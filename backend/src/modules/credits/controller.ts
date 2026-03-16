import { Request, Response, NextFunction } from 'express';
import { CreditsService } from './service';

export const CreditsController = {
    async getBalance(req: Request, res: Response, next: NextFunction) {
        try {
            // Assuming authentication middleware sets req.user.id
            const userId = (req as any).user.id;
            const balance = await CreditsService.getBalance(userId);

            res.status(200).json({
                status: 'success',
                data: { balance }
            });
        } catch (error) {
            next(error);
        }
    },

    async getHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const history = await CreditsService.getCreditHistory(userId, { page, limit });

            res.status(200).json({
                status: 'success',
                data: history
            });
        } catch (error) {
            next(error);
        }
    }
};
