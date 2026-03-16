import { Request, Response, NextFunction } from 'express';
import { CoverLettersService } from './service';

export const CoverLettersController = {
    async createCoverLetter(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const result = await CoverLettersService.createCoverLetter(userId, req.body);

            res.status(201).json({
                success: true,
                data: result.coverLetter,
                credits: result.credits,
            });
        } catch (error) {
            next(error);
        }
    },

    async getUserCoverLetters(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 12;
            const search = req.query.search as string | undefined;

            const result = await CoverLettersService.getUserCoverLetters(userId, { page, limit, search });

            res.status(200).json({
                success: true,
                data: result.data,
                meta: result.meta,
            });
        } catch (error) {
            next(error);
        }
    },

    async getCoverLetterById(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const id = req.params.id as string;

            const coverLetter = await CoverLettersService.getCoverLetterById(id, userId);

            res.status(200).json({
                success: true,
                data: coverLetter,
            });
        } catch (error) {
            next(error);
        }
    },

    async getCoverLetterBySlug(req: Request, res: Response, next: NextFunction) {
        try {
            const slug = req.params.slug as string;
            const ipAddress = req.ip || req.socket.remoteAddress;
            const userAgent = req.headers['user-agent'];

            const coverLetter = await CoverLettersService.getCoverLetterBySlug(slug, {
                ipAddress,
                userAgent
            });

            res.status(200).json({
                success: true,
                data: coverLetter,
            });
        } catch (error) {
            next(error);
        }
    },

    async updateCoverLetter(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const id = req.params.id as string;

            const coverLetter = await CoverLettersService.updateCoverLetter(id, userId, req.body);

            res.status(200).json({
                success: true,
                data: coverLetter,
            });
        } catch (error) {
            next(error);
        }
    },

    async deleteCoverLetter(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const id = req.params.id as string;

            await CoverLettersService.deleteCoverLetter(id, userId);

            res.status(200).json({
                success: true,
                message: 'Cover Letter deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    },

    async duplicateCoverLetter(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const id = req.params.id as string;

            const result = await CoverLettersService.duplicateCoverLetter(id, userId);

            res.status(201).json({
                success: true,
                data: result.coverLetter,
                credits: result.credits,
            });
        } catch (error) {
            next(error);
        }
    },

    async getVersions(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const id = req.params.id as string;

            const versions = await CoverLettersService.getVersions(id, userId);

            res.status(200).json({
                success: true,
                data: versions,
            });
        } catch (error) {
            next(error);
        }
    },

    async getVersionContent(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const id = req.params.id as string;
            const versionId = req.params.versionId as string;

            const version = await CoverLettersService.getVersionContent(id, versionId, userId);

            res.status(200).json({
                success: true,
                data: version,
            });
        } catch (error) {
            next(error);
        }
    },

    async restoreVersion(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const id = req.params.id as string;
            const versionId = req.params.versionId as string;

            const coverLetter = await CoverLettersService.restoreVersion(id, versionId, userId);

            res.status(200).json({
                success: true,
                data: coverLetter,
            });
        } catch (error) {
            next(error);
        }
    },

    async updateThumbnail(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const id = req.params.id as string;
            const { thumbnailUrl } = req.body;

            if (!thumbnailUrl) {
                res.status(400).json({ success: false, message: 'thumbnailUrl is required' });
                return;
            }

            const coverLetter = await CoverLettersService.updateThumbnail(id, userId, thumbnailUrl);

            res.status(200).json({
                success: true,
                data: coverLetter,
            });
        } catch (error) {
            next(error);
        }
    }
};
