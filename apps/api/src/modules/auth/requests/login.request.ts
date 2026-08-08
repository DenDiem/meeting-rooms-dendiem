import { z, type ZodType } from 'zod';

import type { LoginDto } from '../dto/login.dto';

export const loginRequestSchema: ZodType<LoginDto> = z.object({
  email: z.string().trim().min(1, 'Email is required.'),
  password: z.string().min(1, 'Password is required.'),
});
