import type { NotificationModel } from '../models/notification.model';

export interface NotificationResource {
  readonly id: string;
  readonly title: string;
  readonly roomName: string;
  readonly endsAt: string;
}

export const toNotificationResource = ({
  id,
  title,
  roomName,
  endsAt,
}: NotificationModel): NotificationResource => ({
  id,
  title,
  roomName,
  endsAt: endsAt.toISOString(),
});
