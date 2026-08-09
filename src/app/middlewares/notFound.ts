import type { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

const notFound: RequestHandler = (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: 'API not found!',
    errorSources: [
      {
        path: req.originalUrl,
        message: 'Your requested path was not found!',
      },
    ],
  });
};

export default notFound;
