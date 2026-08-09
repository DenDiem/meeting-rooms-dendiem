import { Module } from '@nestjs/common';

import { PrismaModule } from '@database/prisma.module';
import { AuthModule } from '@modules/auth/auth.module';
import { OfficeModule } from '@modules/office/office.module';
import { RoomsModule } from '@modules/rooms/rooms.module';

import { BookingsController } from './controllers/bookings.controller';
import { BOOKING_REPOSITORY } from './interfaces/booking-repository.interface';
import { PrismaBookingRepository } from './repositories/prisma-booking.repository';
import { BookingsService } from './services/bookings.service';

@Module({
  imports: [PrismaModule, AuthModule, OfficeModule, RoomsModule],
  controllers: [BookingsController],
  providers: [BookingsService, { provide: BOOKING_REPOSITORY, useClass: PrismaBookingRepository }],
})
export class BookingsModule {}
