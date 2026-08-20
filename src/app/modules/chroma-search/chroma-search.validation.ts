import { z } from 'zod';

const chromaSearchValidationSchema = z.object({
  body: z.object({
    query: z.string().trim().min(1, 'Query is required!'),
    limit: z
      .number()
      .int('Limit must be an integer!')
      .min(1, 'Limit must be at least 1!')
      .max(10, 'Limit cannot be greater than 10!')
      .optional(),
  }),
});

export const ChromaSearchValidations = {
  chromaSearchValidationSchema,
};