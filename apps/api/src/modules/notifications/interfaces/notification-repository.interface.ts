import type { NewNotificationDto } from '../dto/new-notification.dto';
import type { EndingBookingModel, NotificationModel } from '../models/notification.model';

export const NOTIFICATION_REPOSITORY = Symbol('NotificationRepository');

export interface NotificationRepository {
  findBookingsEndingSoon(userId: string, from: Date, until: Date): Promise<EndingBookingModel[]>;
  createMissing(notifications: readonly NewNotificationDto[]): Promise<void>;
  findUnread(userId: string, now: Date): Promise<NotificationModel[]>;
  markRead(id: NotificationModel['id'], userId: string, readAt: Date): Promise<number>;
}
