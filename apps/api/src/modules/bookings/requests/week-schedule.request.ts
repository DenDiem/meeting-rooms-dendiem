import { z, type ZodType } from 'zod';

import type { WeekScheduleDto } from '../dto/week-schedule.dto';

export const weekScheduleRequestSchema: ZodType<WeekScheduleDto> = z.object({
  roomId: z.uuid('Choose a room.'),
  week: z.iso.date('Enter a valid week date.'),
});
