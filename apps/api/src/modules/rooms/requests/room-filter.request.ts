import { z, type ZodType } from 'zod';

import { MAX_ROOM_CAPACITY } from '../constants/rooms.constants';
import type { RoomFilterDto } from '../dto/room-filter.dto';

export const roomFilterRequestSchema: ZodType<RoomFilterDto> = z.object({
  minCapacity: z.coerce
    .number()
    .int('Minimum capacity must be a whole number.')
    .min(1, 'Minimum capacity must be at least 1.')
    .max(MAX_ROOM_CAPACITY, `Minimum capacity must be ${MAX_ROOM_CAPACITY} or fewer.`)
    .optional(),
});
