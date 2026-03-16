import { Router } from 'express';
import multer from 'multer';
import { ATSController } from '../controllers/ats.controller';
import { authenticate } from '../middleware/authenticate';
import { atsScanLimiter } from '../middleware/rateLimiter';
import { config } from '../config';

const router = Router();

// ─── Multer config for resume uploads (memory storage) ───────
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: config.MAX_FILE_SIZE_MB * 1024 * 1024,
        files: 1,
    },
});

// All ATS routes require authentication
router.use(authenticate);

// ─── Scan endpoints (rate-limited: 10 req/hour) ─────────────
router.post(
    '/scan-resume',
    atsScanLimiter,
    upload.single('resume'),
    ATSController.scanResume
);

router.post(
    '/match-job',
    atsScanLimiter,
    upload.single('resume'),
    ATSController.matchJobDescription
);

// ─── Read endpoints (no extra rate limit) ────────────────────
router.get('/scans', ATSController.getUserScans);
router.get('/scans/:scanId', ATSController.getScanById);

export default router;
