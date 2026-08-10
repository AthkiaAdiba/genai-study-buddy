import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { StudyValidations } from './study.validation';
import { StudyControllers } from './study.controller';

const router = Router();

router.post(
  '/generate',
  validateRequest(StudyValidations.generateStudyResponseValidationSchema),
  StudyControllers.generateStudyResponse,
);

export const StudyRoutes = router;
