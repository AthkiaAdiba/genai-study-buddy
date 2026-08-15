import { z } from 'zod';

const chatMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1, {
    error: 'Message content cannot be empty!',
  }),
});

const chatRequestValidationSchema = z.object({
  body: z.object({
    messages: z.array(chatMessageSchema).min(1, {
      error: 'At least one chat message is required!',
    }),
  }),
});

export const ChatValidations = {
  chatRequestValidationSchema,
};
