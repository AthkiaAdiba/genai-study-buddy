import type { NextFunction, Request, Response } from 'express';
import { ChromaSearchServices } from './chroma-search.service';

const searchSimilarDocuments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result =
      await ChromaSearchServices.searchSimilarDocuments(req.body);

    res.status(200).json({
      success: true,
      message: 'ChromaDB semantic search completed successfully!',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const ChromaSearchControllers = {
  searchSimilarDocuments,
};