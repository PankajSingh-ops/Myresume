import { Router } from 'express';
import { ExportController } from './controller';
import { authenticate } from '../../middleware/authenticate';
import { uploadMiddleware } from '../../middleware/upload';
// Use existing global rate limiter if explicit ones for uploads/exports don't exist yet
import { generalLimiter as rateLimiter } from '../../middleware/rateLimiter';

const router = Router();

// ----------------------------------------
// Export Routes (PDF Generation)
// ----------------------------------------

// Get the short-lived JWT token to allow Puppeteer to render the frontend page securely
router.get('/token/:resumeId', authenticate, ExportController.getExportToken);
router.get('/token/cover-letter/:coverLetterId', authenticate, ExportController.getCoverLetterExportToken);

// Generate and download the PDF securely, deducting credits
router.post(
    '/pdf/:resumeId',
    rateLimiter, // Use rate limiting to protect Puppeteer usage
    authenticate,
    ExportController.exportResumePDF
);

router.post(
    '/pdf/cover-letter/:coverLetterId',
    rateLimiter,
    authenticate,
    ExportController.exportCoverLetterPDF
);

// ----------------------------------------
// Upload Routes (Images)
// ----------------------------------------

// Upload user avatar
router.post(
    '/avatar',
    rateLimiter,
    authenticate,
    uploadMiddleware.single('avatar'), // Mutler middleware looks for 'avatar' field
    ExportController.uploadAvatar
);

// Upload specific resume photo (if a template supports a photo attachment)
router.post(
    '/resume-photo/:resumeId',
    rateLimiter,
    authenticate,
    uploadMiddleware.single('photo'), // Multer middleware looks for 'photo' field
    ExportController.uploadResumePhoto
);

export default router;
