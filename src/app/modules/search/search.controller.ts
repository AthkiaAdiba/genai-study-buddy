import type { NextFunction, Request, Response } from 'express';
import { SearchServices } from './search.service';

const searchSimilarDocuments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await SearchServices.searchSimilarDocuments(req.body);

    res.status(200).json({
      success: true,
      message: 'Semantic search completed successfully!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const SearchControllers = {
  searchSimilarDocuments,
};
