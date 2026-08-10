import { Request, Response } from 'express';
import { StudyServices } from './study.service';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';

const generateStudyResponse = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const result = await StudyServices.generateStudyResponse(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Study response generated successfully!',
    data: result,
  });
};

export const StudyControllers = {
  generateStudyResponse,
};
