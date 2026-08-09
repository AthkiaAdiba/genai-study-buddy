import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import AppError from '../errors/AppError';
import type { TErrorSources } from '../interface/error';
import config from '../config';

const globalErrorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let statusCode = 500;
  let message = 'Something went wrong!';

  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong!',
    },
  ];

  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';

    errorSources = err.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;

    errorSources = [
      {
        path: '',
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err.message;

    errorSources = [
      {
        path: '',
        message: err.message,
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.nodeEnv === 'development' ? err?.stack : null,
  });
};

export default globalErrorHandler;
