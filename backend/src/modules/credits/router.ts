import express from 'express';
import { CreditsController } from './controller';
import { authenticate } from '../../middleware/authenticate';
import { creditCheckLimiter } from '../../middleware/rateLimiter';

const router = express.Router();

// Apply real auth and specific credit limits
router.use(authenticate);
router.use(creditCheckLimiter);

router.get('/balance', CreditsController.getBalance);
router.get('/history', CreditsController.getHistory);

export default router;
