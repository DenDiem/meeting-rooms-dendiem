import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '@modules/auth/auth.module';
import { BookingsModule } from '@modules/bookings/bookings.module';
import { HealthModule } from '@modules/health/health.module';
import { RoomsModule } from '@modules/rooms/rooms.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../../.env' }),
    HealthModule,
    AuthModule,
    RoomsModule,
    BookingsModule,
  ],
})
export class AppModule {}
