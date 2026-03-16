import { Router } from 'express';
import { AIController } from './controller';
import { authenticate } from '../../middleware/authenticate';
import { validateBody } from '../../middleware/validateRequest';
import { aiLimiter } from '../../middleware/rateLimiter';
import {
    improveBulletsSchema,
    improveSummarySchema,
    improveCoverLetterSchema,
    generateBulletsSchema,
    suggestSkillsSchema,
    rewriteSectionSchema
} from './schemas';

const router = Router();

// Every route requires auth and AI-specific rate limits
router.use(authenticate, aiLimiter);

router.post(
    '/improve-bullets',
    validateBody(improveBulletsSchema),
    AIController.improveBullets
);

router.post(
    '/improve-summary',
    validateBody(improveSummarySchema),
    AIController.improveSummary
);

router.post(
    '/improve-cover-letter',
    validateBody(improveCoverLetterSchema),
    AIController.improveCoverLetter
);

router.post(
    '/generate-bullets',
    validateBody(generateBulletsSchema),
    AIController.generateBullets
);

router.post(
    '/suggest-skills',
    validateBody(suggestSkillsSchema),
    AIController.suggestSkills
);

router.post(
    '/rewrite-section',
    validateBody(rewriteSectionSchema),
    AIController.rewriteSection
);

export default router;
