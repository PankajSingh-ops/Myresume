import express, { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { authenticate } from '../../middleware/authenticate';
import { uploadLimiter } from '../../middleware/rateLimiter';
import { UploadService } from './service';

const router = Router();

// Configure Multer (memory storage since we process with sharp before saving)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req: Request, file: Express.Multer.File, cb: any) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Upload avatar
router.post(
    '/avatar',
    authenticate,
    uploadLimiter,
    upload.single('avatar'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.file) {
                res.status(400).json({ error: 'No file provided' });
                return;
            }
            const userId = (req as any).user.id;
            const result = await UploadService.uploadAvatar(userId, req.file);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
);

// Upload resume photo
router.post(
    '/photo/:resumeId',
    authenticate,
    uploadLimiter,
    upload.single('photo'),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.file) {
                res.status(400).json({ error: 'No file provided' });
                return;
            }
            const userId = (req as any).user.id;
            const resumeId = req.params.resumeId as string;
            const result = await UploadService.uploadResumePhoto(userId, resumeId, req.file);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
);

export default router;
