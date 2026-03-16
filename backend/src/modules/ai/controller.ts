import { Request, Response, NextFunction } from 'express';
import { AIService } from './service';
import {
    ImproveBulletsDTO,
    ImproveSummaryDTO,
    ImproveCoverLetterDTO,
    GenerateBulletsDTO,
    SuggestSkillsDTO,
    RewriteSectionDTO
} from './schemas';

export const AIController = {
    async improveBullets(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const data: ImproveBulletsDTO = req.body;

            const result = await AIService.improveBullets(userId, data);

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async improveSummary(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const data: ImproveSummaryDTO = req.body;

            const result = await AIService.improveSummary(userId, data);

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async improveCoverLetter(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const data: ImproveCoverLetterDTO = req.body;

            const result = await AIService.improveCoverLetter(userId, data);

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async generateBullets(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const data: GenerateBulletsDTO = req.body;

            const result = await AIService.generateBullets(userId, data);

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async suggestSkills(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const data: SuggestSkillsDTO = req.body;

            const result = await AIService.suggestSkills(userId, data);

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    async rewriteSection(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const data: RewriteSectionDTO = req.body;

            const result = await AIService.rewriteSection(userId, data);

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
};
