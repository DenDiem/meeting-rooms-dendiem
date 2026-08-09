import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { MILLISECONDS_PER_MINUTE } from '@common/constants/time.constants';

import { NOTIFICATION_NOT_FOUND_MESSAGE } from '../constants/notifications.constants';
import {
  NOTIFICATION_CONFIG,
  type NotificationConfig,
} from '../interfaces/notification-config.interface';
import {
  NOTIFICATION_REPOSITORY,
  type NotificationRepository,
} from '../interfaces/notification-repository.interface';
import type { NotificationModel } from '../models/notification.model';
import {
  toNotificationResource,
  type NotificationResource,
} from '../resources/notification.resource';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly notificationRepository: NotificationRepository,
    @Inject(NOTIFICATION_CONFIG) private readonly notificationConfig: NotificationConfig,
  ) {}

  public async pending(userId: string): Promise<NotificationResource[]> {
    const now = new Date();
    const until = new Date(
      now.getTime() + this.notificationConfig.notifyBeforeMinutes * MILLISECONDS_PER_MINUTE,
    );

    const ending = await this.notificationRepository.findBookingsEndingSoon(userId, now, until);

    if (ending.length > 0) {
      await this.notificationRepository.createMissing(
        ending.map(({ id, nextBookingId }) => ({ userId, bookingId: id, nextBookingId })),
      );
    }

    const notifications = await this.notificationRepository.findUnread(userId, now);

    return notifications.map(toNotificationResource);
  }

  public async markRead(id: NotificationModel['id'], userId: string): Promise<void> {
    const marked = await this.notificationRepository.markRead(id, userId, new Date());

    if (marked === 0) {
      throw new NotFoundException(NOTIFICATION_NOT_FOUND_MESSAGE);
    }
  }
}
