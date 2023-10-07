import { z } from 'zod';

export const SendMessageValidator = z.object({
  fileId: z.number(),
  filePublicId: z.string(),
  message: z.string().min(1).max(500)
});
