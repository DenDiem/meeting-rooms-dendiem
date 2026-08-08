import { z, type ZodType } from 'zod';

import {
  EMAIL_MAX_LENGTH,
  NAME_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
} from '../constants/auth.constants';
import type { RegisterDto } from '../dto/register.dto';

export const registerRequestSchema: ZodType<RegisterDto> = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required.')
    .max(NAME_MAX_LENGTH, `Name must be ${NAME_MAX_LENGTH} characters or fewer.`),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required.')
    .max(EMAIL_MAX_LENGTH, 'Email is too long.')
    .pipe(z.email('Enter a valid email address.')),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`)
    .max(PASSWORD_MAX_LENGTH, `Password must be ${PASSWORD_MAX_LENGTH} characters or fewer.`),
});
