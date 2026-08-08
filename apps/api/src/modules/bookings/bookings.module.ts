import { Module } from '@nestjs/common';

import { PrismaModule } from '@database/prisma.module';
import { AuthModule } from '@modules/auth/auth.module';
import { RoomsModule } from '@modules/rooms/rooms.module';

import { BookingsController } from './controllers/bookings.controller';
import { BOOKING_REPOSITORY } from './interfaces/booking-repository.interface';
import { PrismaBookingRepository } from './repositories/prisma-booking.repository';
import { BookingsService } from './services/bookings.service';
import { OfficeHoursService } from './services/office-hours.service';

@Module({
  imports: [PrismaModule, AuthModule, RoomsModule],
  controllers: [BookingsController],
  providers: [
    BookingsService,
    OfficeHoursService,
    { provide: BOOKING_REPOSITORY, useClass: PrismaBookingRepository },
  ],
})
export class BookingsModule {}
