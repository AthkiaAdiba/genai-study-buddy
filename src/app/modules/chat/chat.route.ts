import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ChatValidations } from './chat.validation';
import { ChatControllers } from './chat.controller';

const router = Router();

router.post(
  '/',
  validateRequest(ChatValidations.chatRequestValidationSchema),
  ChatControllers.generateChatResponse,
);

export const ChatRoutes = router;
