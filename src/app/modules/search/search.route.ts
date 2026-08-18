import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SearchControllers } from './search.controller';
import { SearchValidations } from './search.validation';

const router = express.Router();

router.post(
  '/',
  validateRequest(SearchValidations.searchDocumentsValidationSchema),
  SearchControllers.searchSimilarDocuments,
);

export const SearchRoutes = router;
