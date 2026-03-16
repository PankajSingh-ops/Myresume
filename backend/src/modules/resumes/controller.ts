import { Request, Response, NextFunction } from 'express';
import { ResumesService } from './service';
import { extractText, parseResumeWithGroq } from './parse-resume';

export const ResumesController = {
    async createResume(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const result = await ResumesService.createResume(userId, req.body);

            res.status(201).json({
                success: true,
                data: result.resume,
                credits: result.credits,
            });
        } catch (error) {
            next(error);
        }
    },

    async getUserResumes(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 12;
            const search = req.query.search as string | undefined;

            const result = await ResumesService.getUserResumes(userId, { page, limit, search });

            res.status(200).json({
                success: true,
                data: result.data,
                meta: result.meta,
            });
        } catch (error) {
            next(error);
        }
    },

    async getResumeById(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const id = req.params.id as string;

            const resume = await ResumesService.getResumeById(id, userId);

            res.status(200).json({
                success: true,
                data: resume,
            });
        } catch (error) {
            next(error);
        }
    },

    async getResumeBySlug(req: Request, res: Response, next: NextFunction) {
        try {
            const slug = req.params.slug as string;
            const ipAddress = req.ip || req.socket.remoteAddress;
            const userAgent = req.headers['user-agent'];

            const resume = await ResumesService.getResumeBySlug(slug, {
                ipAddress,
                userAgent
            });

            res.status(200).json({
                success: true,
                data: resume,
            });
        } catch (error) {
            next(error);
        }
    },

    async updateResume(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const id = req.params.id as string;

            const resume = await ResumesService.updateResume(id, userId, req.body);

            res.status(200).json({
                success: true,
                data: resume,
            });
        } catch (error) {
            next(error);
        }
    },

    async deleteResume(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const id = req.params.id as string;

            await ResumesService.deleteResume(id, userId);

            res.status(200).json({
                success: true,
                message: 'Resume deleted successfully',
            });
        } catch (error) {
            next(error);
        }
    },

    async duplicateResume(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const id = req.params.id as string;

            const result = await ResumesService.duplicateResume(id, userId);

            res.status(201).json({
                success: true,
                data: result.resume,
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

            const versions = await ResumesService.getVersions(id, userId);

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

            const version = await ResumesService.getVersionContent(id, versionId, userId);

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

            const resume = await ResumesService.restoreVersion(id, versionId, userId);

            res.status(200).json({
                success: true,
                data: resume,
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

            const resume = await ResumesService.updateThumbnail(id, userId, thumbnailUrl);

            res.status(200).json({
                success: true,
                data: resume,
            });
        } catch (error) {
            next(error);
        }
    },

    async parseUpload(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const file = req.file;

            if (!file) {
                res.status(400).json({ success: false, message: 'No file uploaded. Please upload a PDF or DOCX file.' });
                return;
            }

            const title = (req.body.title || 'Imported Resume').trim();
            const templateId = req.body.templateId || 'classic';

            // 1. Extract raw text from the uploaded file
            const rawText = await extractText(file.path, file.mimetype);

            // 2. Parse with Groq AI
            const parsedContent = await parseResumeWithGroq(rawText);

            // 3. Create the resume with parsed content (deducts 20 credits)
            const result = await ResumesService.createResume(userId, {
                title,
                templateId,
                content: parsedContent,
            });

            res.status(201).json({
                success: true,
                data: result.resume,
                credits: result.credits,
            });
        } catch (error) {
            next(error);
        }
    },
};

