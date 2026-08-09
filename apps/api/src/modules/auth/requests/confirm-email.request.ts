import { z, type ZodType } from 'zod';

import type { ConfirmEmailDto } from '../dto/confirm-email.dto';

export const confirmEmailRequestSchema: ZodType<ConfirmEmailDto> = z.object({
  token: z.string().min(1, 'The confirmation link is incomplete.'),
});
