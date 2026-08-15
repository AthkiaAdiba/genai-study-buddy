import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../utils/sendResponse';
import { ChatServices } from './chat.service';

const generateChatResponse = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const result = await ChatServices.generateChatResponse(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Chat response generated successfully!',
    data: result,
  });
};

export const ChatControllers = {
  generateChatResponse,
};
