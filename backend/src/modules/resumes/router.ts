import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { nanoid } from 'nanoid';
import { ResumesController } from './controller';
import { authenticate } from '../../middleware/authenticate';
import { validateBody } from '../../middleware/validateRequest';
import { createResumeSchema, updateResumeSchema } from './schemas';

const router = Router();

// ── Multer disk storage for resume uploads ───────────────────────────
const uploadsDir = path.join(__dirname, '../../../uploads/resumes');
// Ensure the uploads directory exists
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${nanoid(8)}${ext}`);
    },
});

const resumeUpload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: (_req, file, cb) => {
        const allowedMimes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
        ];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and DOCX files are allowed.'));
        }
    },
});

// Public route for viewing a resume by slug (no auth required)
router.get('/r/:slug', ResumesController.getResumeBySlug);

// All other routes require authentication
router.use(authenticate);

// List user's resumes
router.get('/', ResumesController.getUserResumes);

// Create a new resume
router.post(
    '/',
    validateBody(createResumeSchema),
    ResumesController.createResume
);

// Upload & parse an existing resume (PDF/DOCX)
router.post(
    '/parse-upload',
    resumeUpload.single('resume'),
    ResumesController.parseUpload
);

// Get a specific resume by ID
router.get('/:id', ResumesController.getResumeById);

// Update a resume
router.patch(
    '/:id',
    validateBody(updateResumeSchema),
    ResumesController.updateResume
);

// Delete a resume
router.delete('/:id', ResumesController.deleteResume);

// Duplicate a resume
router.post('/:id/duplicate', ResumesController.duplicateResume);

// Get version history for a resume
router.get('/:id/versions', ResumesController.getVersions);

// Get specific version content
router.get('/:id/versions/:versionId', ResumesController.getVersionContent);

// Restore a resume to a specific version
router.post('/:id/versions/:versionId/restore', ResumesController.restoreVersion);

// Update resume thumbnail
router.patch('/:id/thumbnail', ResumesController.updateThumbnail);

export default router;

