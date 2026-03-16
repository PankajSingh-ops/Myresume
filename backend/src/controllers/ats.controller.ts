import { Request, Response, NextFunction } from 'express';
import path from 'path';
import os from 'os';
import fs from 'fs-extra';
import { z } from 'zod';
import { atsService } from '../services/ats.service';
import { fileParserService } from '../services/fileParser.service';
import { AppError } from '../modules/credits/errors';

// ─── Allowed MIME types ──────────────────────────────────────
const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
    'text/plain',
];

// ─── Zod Schemas ─────────────────────────────────────────────

const jobDescriptionSchema = z.string({
    message: 'Job description is required.',
}).min(50, 'Job description must be at least 50 characters.')
    .max(5000, 'Job description must not exceed 5000 characters.');

const paginationSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
});

const scanIdSchema = z.object({
    scanId: z.string().uuid('Invalid scan ID format.'),
});

// ─── Helpers ─────────────────────────────────────────────────

/**
 * Writes a multer memory-buffer file to a temporary path so
 * FileParserService.parseFile() can read it from disk.
 */
async function writeBufferToTemp(file: Express.Multer.File): Promise<string> {
    const ext = path.extname(file.originalname) || '.tmp';
    const tmpPath = path.join(os.tmpdir(), `ats_upload_${Date.now()}${ext}`);
    await fs.writeFile(tmpPath, file.buffer);
    return tmpPath;
}

function validateUploadedFile(file: Express.Multer.File | undefined): Express.Multer.File {
    if (!file) {
        throw new AppError(400, 'MISSING_FILE', 'A resume file is required.');
    }

    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        throw new AppError(
            400,
            'INVALID_FILE_TYPE',
            'Unsupported file type. Please upload a PDF, DOCX, or TXT file.'
        );
    }

    return file;
}

// ─── Controller ──────────────────────────────────────────────

export const ATSController = {
    /**
     * POST /api/ats/scan-resume
     * Expects multipart/form-data with file field "resume"
     */
    async scanResume(req: Request, res: Response, next: NextFunction) {
        try {
            const userId: string = (req as any).user.id;
            const file = validateUploadedFile(req.file);

            // Write buffer to temp file so the parser can read it
            const tmpPath = await writeBufferToTemp(file);

            try {
                const resumeText = await fileParserService.parseFile(tmpPath, file.mimetype);

                const { scanId, result, credits } = await atsService.scanResume(
                    userId,
                    resumeText,
                    file.originalname
                );

                res.status(200).json({
                    success: true,
                    data: result,
                    scanId,
                    credits,
                });
            } catch (err) {
                // parseFile already cleans up tmpPath on its own, but if
                // atsService throws after parsing, the temp is already gone.
                throw err;
            }
        } catch (error) {
            next(error);
        }
    },

    /**
     * POST /api/ats/match-job
     * Expects multipart/form-data with file field "resume" + text field "job_description"
     */
    async matchJobDescription(req: Request, res: Response, next: NextFunction) {
        try {
            const userId: string = (req as any).user.id;
            const file = validateUploadedFile(req.file);

            // Validate job_description from form body
            const jobDescription = jobDescriptionSchema.parse(req.body.job_description);

            // Write buffer to temp file so the parser can read it
            const tmpPath = await writeBufferToTemp(file);

            try {
                const resumeText = await fileParserService.parseFile(tmpPath, file.mimetype);

                const { scanId, result, credits } = await atsService.matchJobDescription(
                    userId,
                    resumeText,
                    jobDescription,
                    file.originalname
                );

                res.status(200).json({
                    success: true,
                    data: result,
                    scanId,
                    credits,
                });
            } catch (err) {
                throw err;
            }
        } catch (error) {
            next(error);
        }
    },

    /**
     * GET /api/ats/scans?page=1&limit=10
     */
    async getUserScans(req: Request, res: Response, next: NextFunction) {
        try {
            const userId: string = (req as any).user.id;
            const { page, limit } = paginationSchema.parse(req.query);

            const { scans, total } = await atsService.getUserScans(userId, page, limit);

            res.status(200).json({
                success: true,
                data: scans,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * GET /api/ats/scans/:scanId
     */
    async getScanById(req: Request, res: Response, next: NextFunction) {
        try {
            const userId: string = (req as any).user.id;
            const { scanId } = scanIdSchema.parse(req.params);

            const scan = await atsService.getScanById(scanId, userId);

            res.status(200).json({
                success: true,
                data: scan,
            });
        } catch (error) {
            next(error);
        }
    },
};
