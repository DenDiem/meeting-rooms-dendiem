import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { RoomsService } from '@modules/rooms/services/rooms.service';

import {
  BOOKING_ALREADY_CANCELED_MESSAGE,
  BOOKING_NOT_FOUND_MESSAGE,
  BOOKING_NOT_YOURS_MESSAGE,
  INVALID_WEEK_MESSAGE,
  SLOT_TAKEN_MESSAGE,
} from '../constants/bookings.constants';
import type { CreateBookingDto } from '../dto/create-booking.dto';
import type { MyBookingsDto } from '../dto/my-bookings.dto';
import type { WeekScheduleDto } from '../dto/week-schedule.dto';
import { BookingScope } from '../enums/booking-scope.enum';
import { SlotTakenException } from '../exceptions/slot-taken.exception';
import { describeBookingTimeViolation, findBookingTimeViolation } from '../helpers/booking-time';
import { officeWeekOf } from '../helpers/office-hours';
import {
  BOOKING_REPOSITORY,
  type BookingRepository,
} from '../interfaces/booking-repository.interface';
import type { BookingModel } from '../models/booking.model';
import { toBookingResource, type BookingResource } from '../resources/booking.resource';
import type { PaginatedBookingsResource } from '../resources/paginated-bookings.resource';
import { OfficeHoursService } from './office-hours.service';

@Injectable()
export class BookingsService {
  constructor(
    @Inject(BOOKING_REPOSITORY) private readonly bookingRepository: BookingRepository,
    private readonly officeHoursService: OfficeHoursService,
    private readonly roomsService: RoomsService,
  ) {}

  public async create(
    { roomId, title, startsAt, endsAt }: CreateBookingDto,
    userId: string,
  ): Promise<BookingResource> {
    await this.roomsService.getById(roomId);

    const interval = { start: startsAt, end: endsAt };
    const violation = findBookingTimeViolation(interval, this.officeHoursService.hours, new Date());

    if (violation) {
      throw new BadRequestException(
        describeBookingTimeViolation(violation, this.officeHoursService.hours),
      );
    }

    if (await this.bookingRepository.findFirst({ roomId, overlapping: interval })) {
      throw new ConflictException(SLOT_TAKEN_MESSAGE);
    }

    try {
      const booking = await this.bookingRepository.create({
        roomId,
        userId,
        title,
        startsAt,
        endsAt,
      });

      return toBookingResource(booking, userId);
    } catch (error) {
      if (error instanceof SlotTakenException) {
        throw new ConflictException(error.message);
      }

      throw error;
    }
  }

  public async cancel(id: BookingModel['id'], userId: string): Promise<void> {
    const booking = await this.bookingRepository.findById(id);

    if (!booking) {
      throw new NotFoundException(BOOKING_NOT_FOUND_MESSAGE);
    }

    if (booking.userId !== userId) {
      throw new ForbiddenException(BOOKING_NOT_YOURS_MESSAGE);
    }

    if (booking.canceledAt) {
      throw new ConflictException(BOOKING_ALREADY_CANCELED_MESSAGE);
    }

    await this.bookingRepository.cancel(id, new Date());
  }

  public async weekSchedule(
    { roomId, week }: WeekScheduleDto,
    userId: string,
  ): Promise<BookingResource[]> {
    await this.roomsService.getById(roomId);

    const range = officeWeekOf(week, this.officeHoursService.hours);

    if (!range) {
      throw new BadRequestException(INVALID_WEEK_MESSAGE);
    }

    const bookings = await this.bookingRepository.findMany({ roomId, overlapping: range }, 'asc');

    return bookings.map((booking) => toBookingResource(booking, userId));
  }

  public async mine(
    { scope, page, perPage }: MyBookingsDto,
    userId: string,
  ): Promise<PaginatedBookingsResource> {
    const now = new Date();
    const isUpcoming = scope === BookingScope.Upcoming;

    const { items, total } = await this.bookingRepository.paginate(
      { userId, ...(isUpcoming ? { endsAfter: now } : { endedBefore: now }) },
      page,
      perPage,
      isUpcoming ? 'asc' : 'desc',
    );

    return {
      items: items.map((booking) => toBookingResource(booking, userId)),
      total,
      page,
      perPage,
    };
  }
}
