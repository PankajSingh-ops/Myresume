import { Request, Response, NextFunction } from 'express';
import { ExportService } from './service';
import { UploadService } from '../upload/service';
import { CreditsService } from '../credits/service';
import { CREDIT_COSTS } from '../credits/constants';

export const ExportController = {
    async getExportToken(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const resumeId = req.params.resumeId as string;

            const token = ExportService.generateExportToken(resumeId, userId);

            res.status(200).json({
                success: true,
                data: { token },
            });
        } catch (error) {
            next(error);
        }
    },

    async getCoverLetterExportToken(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const coverLetterId = req.params.coverLetterId as string;

            const token = ExportService.generateCoverLetterExportToken(coverLetterId, userId);

            res.status(200).json({
                success: true,
                data: { token },
            });
        } catch (error) {
            next(error);
        }
    },

    async exportResumePDF(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const resumeId = req.params.resumeId as string;

            // PRE-FLIGHT CHECK: Fast check to avoid spinning up puppeteer if credits are low
            const check = await CreditsService.checkSufficientCredits(userId, CREDIT_COSTS.PDF_EXPORT);
            if (!check.sufficient) {
                res.status(402).json({
                    type: 'https://tools.ietf.org/html/rfc7807#section-3.1',
                    title: 'Insufficient Credits',
                    status: 402,
                    detail: `You need ${check.required} credits but only have ${check.balance}.`,
                });
                return;
            }

            // Generates the PDF buffer using Puppeteer + atomic db transaction
            const result = await ExportService.exportResumePDF(userId, resumeId);

            // Send the downloaded buffer dynamically with the right headers
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
            res.setHeader('X-Credits-Deducted', String(result.credits.deducted));
            res.setHeader('X-Credits-Balance', String(result.credits.newBalance));

            // Standard send buffer
            res.send(Buffer.from(result.pdfBuffer));

        } catch (error) {
            next(error);
        }
    },

    async exportCoverLetterPDF(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const coverLetterId = req.params.coverLetterId as string;

            const check = await CreditsService.checkSufficientCredits(userId, CREDIT_COSTS.PDF_EXPORT);
            if (!check.sufficient) {
                res.status(402).json({
                    type: 'https://tools.ietf.org/html/rfc7807#section-3.1',
                    title: 'Insufficient Credits',
                    status: 402,
                    detail: `You need ${check.required} credits but only have ${check.balance}.`,
                });
                return;
            }

            const result = await ExportService.exportCoverLetterPDF(userId, coverLetterId);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
            res.setHeader('X-Credits-Deducted', String(result.credits.deducted));
            res.setHeader('X-Credits-Balance', String(result.credits.newBalance));

            res.send(Buffer.from(result.pdfBuffer));

        } catch (error) {
            next(error);
        }
    },

    async uploadAvatar(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;

            // req.file is populated by multer
            if (!req.file) {
                res.status(400).json({ success: false, message: 'No file provided' });
                return;
            }

            const result = await UploadService.uploadAvatar(userId, req.file);

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    async uploadResumePhoto(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = (req as any).user.id;
            const resumeId = req.params.resumeId as string;

            if (!req.file) {
                res.status(400).json({ success: false, message: 'No file provided' });
                return;
            }

            const result = await UploadService.uploadResumePhoto(userId, resumeId, req.file);

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
};
