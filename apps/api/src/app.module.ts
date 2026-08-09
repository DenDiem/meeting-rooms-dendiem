import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '@modules/auth/auth.module';
import { BookingsModule } from '@modules/bookings/bookings.module';
import { HealthModule } from '@modules/health/health.module';
import { NotificationsModule } from '@modules/notifications/notifications.module';
import { OfficeModule } from '@modules/office/office.module';
import { RoomsModule } from '@modules/rooms/rooms.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../../.env' }),
    HealthModule,
    AuthModule,
    OfficeModule,
    RoomsModule,
    BookingsModule,
    NotificationsModule,
  ],
})
export class AppModule {}
