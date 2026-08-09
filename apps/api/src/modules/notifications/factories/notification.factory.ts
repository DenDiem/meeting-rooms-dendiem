import type { Booking, Notification, Room } from '@generated/prisma/client';

import type { NotificationModel } from '../models/notification.model';

type NotificationRow = Notification & { booking: Booking & { room: Pick<Room, 'name'> } };

export const toNotificationModel = ({
  id,
  userId,
  booking,
}: NotificationRow): NotificationModel => ({
  id,
  userId,
  title: booking.title,
  endsAt: booking.endsAt,
  roomName: booking.room.name,
});
