import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { readNumber } from '@config/read-number';
import { PrismaModule } from '@database/prisma.module';
import { AuthModule } from '@modules/auth/auth.module';

import { DEFAULT_NOTIFY_BEFORE_MINUTES } from './constants/notifications.constants';
import { NotificationsController } from './controllers/notifications.controller';
import {
  NOTIFICATION_CONFIG,
  type NotificationConfig,
} from './interfaces/notification-config.interface';
import { NOTIFICATION_REPOSITORY } from './interfaces/notification-repository.interface';
import { PrismaNotificationRepository } from './repositories/prisma-notification.repository';
import { NotificationsService } from './services/notifications.service';

const notificationConfigProvider = {
  provide: NOTIFICATION_CONFIG,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): NotificationConfig => ({
    notifyBeforeMinutes: readNumber(
      configService.get('NOTIFY_BEFORE_MINUTES'),
      DEFAULT_NOTIFY_BEFORE_MINUTES,
    ),
  }),
};

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [NotificationsController],
  providers: [
    notificationConfigProvider,
    NotificationsService,
    { provide: NOTIFICATION_REPOSITORY, useClass: PrismaNotificationRepository },
  ],
})
export class NotificationsModule {}
