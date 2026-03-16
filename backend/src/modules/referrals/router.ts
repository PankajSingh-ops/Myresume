import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { ReferralController } from './controller';

const referralsRouter = Router();

referralsRouter.get('/stats', authenticate, ReferralController.getStats);

export { referralsRouter };
