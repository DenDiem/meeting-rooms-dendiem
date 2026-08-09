import { Injectable } from '@nestjs/common';

import { PrismaService } from '@database/prisma.service';

import type { NewNotificationDto } from '../dto/new-notification.dto';
import { toNotificationModel } from '../factories/notification.factory';
import type { NotificationRepository } from '../interfaces/notification-repository.interface';
import type { EndingBookingModel, NotificationModel } from '../models/notification.model';

@Injectable()
export class PrismaNotificationRepository implements NotificationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async findBookingsEndingSoon(
    userId: string,
    from: Date,
    until: Date,
  ): Promise<EndingBookingModel[]> {
    const bookings = await this.prismaService.booking.findMany({
      where: { userId, canceledAt: null, endsAt: { gte: from, lte: until } },
      include: { room: { select: { name: true } } },
    });

    const ending: EndingBookingModel[] = [];

    for (const booking of bookings) {
      const next = await this.prismaService.booking.findFirst({
        where: { roomId: booking.roomId, canceledAt: null, startsAt: booking.endsAt },
        select: { id: true },
      });

      if (next) {
        ending.push({
          id: booking.id,
          userId: booking.userId,
          title: booking.title,
          endsAt: booking.endsAt,
          roomName: booking.room.name,
          nextBookingId: next.id,
        });
      }
    }

    return ending;
  }

  public async createMissing(notifications: readonly NewNotificationDto[]): Promise<void> {
    await this.prismaService.notification.createMany({
      data: [...notifications],
      skipDuplicates: true,
    });
  }

  public async findUnread(userId: string, now: Date): Promise<NotificationModel[]> {
    const notifications = await this.prismaService.notification.findMany({
      where: {
        userId,
        readAt: null,
        booking: { canceledAt: null, endsAt: { gt: now } },
        nextBooking: { canceledAt: null },
      },
      include: { booking: { include: { room: { select: { name: true } } } } },
      orderBy: { createdAt: 'asc' },
    });

    return notifications.map(toNotificationModel);
  }

  public async markRead(
    id: NotificationModel['id'],
    userId: string,
    readAt: Date,
  ): Promise<number> {
    const { count } = await this.prismaService.notification.updateMany({
      where: { id, userId, readAt: null },
      data: { readAt },
    });

    return count;
  }
}
