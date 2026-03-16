import { Router } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { validateBody } from '../../middleware/validateRequest';
import { createCoverLetterSchema, updateCoverLetterSchema } from './schemas';
import { CoverLettersController } from './controller';

const router = Router();

router.get('/c/:slug', CoverLettersController.getCoverLetterBySlug);

router.use(authenticate);

router.get('/', CoverLettersController.getUserCoverLetters);
router.post('/', validateBody(createCoverLetterSchema), CoverLettersController.createCoverLetter);
router.get('/:id', CoverLettersController.getCoverLetterById);
router.patch('/:id', validateBody(updateCoverLetterSchema), CoverLettersController.updateCoverLetter);
router.delete('/:id', CoverLettersController.deleteCoverLetter);
router.post('/:id/duplicate', CoverLettersController.duplicateCoverLetter);
router.get('/:id/versions', CoverLettersController.getVersions);
router.get('/:id/versions/:versionId', CoverLettersController.getVersionContent);
router.post('/:id/versions/:versionId/restore', CoverLettersController.restoreVersion);
router.patch('/:id/thumbnail', CoverLettersController.updateThumbnail);

export default router;
