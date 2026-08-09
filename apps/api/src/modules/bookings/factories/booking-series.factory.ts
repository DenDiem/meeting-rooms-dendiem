import type { BookingSeries } from '@generated/prisma/client';

import type { BookingSeriesModel } from '../models/booking-series.model';

export const toBookingSeriesModel = ({
  id,
  roomId,
  userId,
  title,
}: BookingSeries): BookingSeriesModel => ({ id, roomId, userId, title });
