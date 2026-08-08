import { z, type ZodType } from 'zod';

import { DEFAULT_PER_PAGE, MAX_PER_PAGE } from '../constants/bookings.constants';
import type { MyBookingsDto } from '../dto/my-bookings.dto';
import { BookingScope } from '../enums/booking-scope.enum';

export const myBookingsRequestSchema: ZodType<MyBookingsDto> = z.object({
  scope: z.enum(BookingScope).default(BookingScope.Upcoming),
  page: z.coerce.number().int().min(1, 'Page must be at least 1.').default(1),
  perPage: z.coerce
    .number()
    .int()
    .min(1, 'Page size must be at least 1.')
    .max(MAX_PER_PAGE, `Page size must be ${MAX_PER_PAGE} or fewer.`)
    .default(DEFAULT_PER_PAGE),
});
