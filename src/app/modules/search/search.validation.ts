import { z } from 'zod';

const searchDocumentsValidationSchema = z.object({
  body: z.object({
    query: z
      .string({
        error: 'Search query is required!',
      })
      .trim()
      .min(1, 'Search query cannot be empty!')
      .max(500, 'Search query cannot contain more than 500 characters!'),

    limit: z
      .number()
      .int('Limit must be a whole number!')
      .min(1, 'Limit must be at least 1!')
      .max(10, 'Limit cannot be greater than 10!')
      .optional(),
  }),
});

export const SearchValidations = {
  searchDocumentsValidationSchema,
};
