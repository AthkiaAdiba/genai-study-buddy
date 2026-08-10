import { z } from 'zod';

const generateStudyResponseValidationSchema = z.object({
  body: z.object({
    topic: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? 'Topic is required!'
            : 'Topic must be string!',
      })
      .min(1, { error: 'Topic cannot be empty!' }),
    level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  }),
});

export const StudyValidations = {
  generateStudyResponseValidationSchema,
};
