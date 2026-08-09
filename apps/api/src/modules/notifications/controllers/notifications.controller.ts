import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from '@modules/auth/decorators/current-user.decorator';
import { SessionGuard } from '@modules/auth/guards/session.guard';
import type { PublicUserResource } from '@modules/auth/resources/public-user.resource';

import type { NotificationResource } from '../resources/notification.resource';
import { NotificationsService } from '../services/notifications.service';

@Controller('notifications')
@UseGuards(SessionGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  public pending(@CurrentUser() user: PublicUserResource): Promise<NotificationResource[]> {
    return this.notificationsService.pending(user.id);
  }

  @Post(':notificationId/read')
  @HttpCode(HttpStatus.NO_CONTENT)
  public markRead(
    @Param('notificationId', ParseUUIDPipe) notificationId: string,
    @CurrentUser() user: PublicUserResource,
  ): Promise<void> {
    return this.notificationsService.markRead(notificationId, user.id);
  }
}
