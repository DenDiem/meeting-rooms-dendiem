import { Filters } from '@common/filters/filters';
import type { Prisma } from '@generated/prisma/client';

import type { BookingFilterDto } from '../dto/booking-filter.dto';

export const bookingFilters = ({
  roomId,
  userId,
  overlapping,
  endsAfter,
  endedBefore,
}: BookingFilterDto): Prisma.BookingWhereInput =>
  Filters.init<Prisma.BookingWhereInput>()
    .add({ canceledAt: null })
    .when(roomId, (id) => ({ roomId: id }))
    .when(userId, (id) => ({ userId: id }))
    .when(overlapping, ({ start, end }) => ({
      startsAt: { lt: end },
      endsAt: { gt: start },
    }))
    .when(endsAfter, (moment) => ({ endsAt: { gt: moment } }))
    .when(endedBefore, (moment) => ({ endsAt: { lte: moment } }))
    .build();
