import type { Booking, Room, User } from '@generated/prisma/client';

import type { BookingDetailsModel, BookingModel } from '../models/booking.model';

type BookingRow = Booking & { room: Pick<Room, 'id' | 'name'>; user: Pick<User, 'id' | 'name'> };

export const toBookingModel = ({
  id,
  roomId,
  userId,
  title,
  startsAt,
  endsAt,
  canceledAt,
}: Booking): BookingModel => ({ id, roomId, userId, title, startsAt, endsAt, canceledAt });

export const toBookingDetailsModel = (booking: BookingRow): BookingDetailsModel => ({
  ...toBookingModel(booking),
  room: { id: booking.room.id, name: booking.room.name },
  user: { id: booking.user.id, name: booking.user.name },
});
