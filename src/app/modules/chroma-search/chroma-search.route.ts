import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ChromaSearchControllers } from './chroma-search.controller';
import { ChromaSearchValidations } from './chroma-search.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(
    ChromaSearchValidations.chromaSearchValidationSchema,
  ),
  ChromaSearchControllers.searchSimilarDocuments,
);

export const ChromaSearchRoutes = router;