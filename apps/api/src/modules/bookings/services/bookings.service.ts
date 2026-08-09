import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Paginated } from '@common/resources/paginated';
import { OfficeHoursService } from '@modules/office/services/office-hours.service';
import { RoomsService } from '@modules/rooms/services/rooms.service';

import {
  BOOKING_ALREADY_CANCELED_MESSAGE,
  BOOKING_NOT_FOUND_MESSAGE,
  BOOKING_NOT_YOURS_MESSAGE,
  SERIES_ALREADY_CANCELED_MESSAGE,
  SERIES_NOT_FOUND_MESSAGE,
  SLOT_ALREADY_BOOKED_MESSAGE,
} from '../constants/bookings.constants';
import type { CreateBookingSeriesDto } from '../dto/create-booking-series.dto';
import type { CreateBookingDto } from '../dto/create-booking.dto';
import type { IntervalDto } from '../dto/interval.dto';
import type { MyBookingsDto } from '../dto/my-bookings.dto';
import type { WeekScheduleDto } from '../dto/week-schedule.dto';
import { BookingScope } from '../enums/booking-scope.enum';
import { SlotTakenException } from '../exceptions/slot-taken.exception';
import { describeBookingTimeViolation, findBookingTimeViolation } from '../helpers/booking-time';
import { describeConflicts } from '../helpers/describe-conflicts';
import { overlaps } from '../helpers/interval';
import { officeWeekOf } from '../helpers/office-hours';
import { weeklyOccurrences } from '../helpers/weekly-occurrences';
import {
  BOOKING_REPOSITORY,
  type BookingRepository,
} from '../interfaces/booking-repository.interface';
import type { BookingSeriesModel } from '../models/booking-series.model';
import type { BookingModel } from '../models/booking.model';
import { toBookingResource, type BookingResource } from '../resources/booking.resource';

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
    await this.roomsService.ensureExists(roomId);

    const interval = { start: startsAt, end: endsAt };
    const violation = findBookingTimeViolation(interval, this.officeHoursService.hours, new Date());

    if (violation) {
      throw new BadRequestException(
        describeBookingTimeViolation(violation, this.officeHoursService.hours),
      );
    }

    if (await this.bookingRepository.findFirst({ roomId, overlapping: interval })) {
      throw new ConflictException(SLOT_ALREADY_BOOKED_MESSAGE);
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

  public async createSeries(
    { roomId, title, startsAt, endsAt, repeats }: CreateBookingSeriesDto,
    userId: string,
  ): Promise<BookingResource[]> {
    await this.roomsService.ensureExists(roomId);

    const occurrences = weeklyOccurrences(
      { start: startsAt, end: endsAt },
      repeats,
      this.officeHoursService.hours,
    );

    this.ensureEveryOccurrenceIsBookable(occurrences);

    const taken = await this.findTakenOccurrences(roomId, occurrences);

    if (taken.length > 0) {
      throw new ConflictException(describeConflicts(taken, this.officeHoursService.hours));
    }

    try {
      const bookings = await this.bookingRepository.createSeries(
        { roomId, userId, title },
        occurrences.map(({ start, end }) => ({
          roomId,
          userId,
          title,
          startsAt: start,
          endsAt: end,
        })),
      );

      return bookings.map((booking) => toBookingResource(booking, userId));
    } catch (error) {
      if (error instanceof SlotTakenException) {
        throw new ConflictException(error.message);
      }

      throw error;
    }
  }

  public async cancelSeries(seriesId: BookingSeriesModel['id'], userId: string): Promise<void> {
    const series = await this.bookingRepository.findSeriesById(seriesId);

    if (!series) {
      throw new NotFoundException(SERIES_NOT_FOUND_MESSAGE);
    }

    if (series.userId !== userId) {
      throw new ForbiddenException(BOOKING_NOT_YOURS_MESSAGE);
    }

    const canceled = await this.bookingRepository.cancelSeries(seriesId, new Date(), new Date());

    if (canceled === 0) {
      throw new ConflictException(SERIES_ALREADY_CANCELED_MESSAGE);
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

  private ensureEveryOccurrenceIsBookable(occurrences: readonly IntervalDto[]): void {
    const now = new Date();

    for (const occurrence of occurrences) {
      const violation = findBookingTimeViolation(occurrence, this.officeHoursService.hours, now);

      if (violation) {
        throw new BadRequestException(
          describeBookingTimeViolation(violation, this.officeHoursService.hours),
        );
      }
    }
  }

  private async findTakenOccurrences(
    roomId: string,
    occurrences: readonly IntervalDto[],
  ): Promise<Date[]> {
    const span = {
      start: occurrences[0]?.start ?? new Date(),
      end: occurrences[occurrences.length - 1]?.end ?? new Date(),
    };

    const booked = await this.bookingRepository.findMany({ roomId, overlapping: span }, 'asc');

    return occurrences
      .filter((occurrence) =>
        booked.some((booking) =>
          overlaps(occurrence, { start: booking.startsAt, end: booking.endsAt }),
        ),
      )
      .map(({ start }) => start);
  }

  public async weekSchedule(
    { roomId, week }: WeekScheduleDto,
    userId: string,
  ): Promise<BookingResource[]> {
    await this.roomsService.ensureExists(roomId);

    const range = officeWeekOf(week, this.officeHoursService.hours);
    const bookings = await this.bookingRepository.findMany({ roomId, overlapping: range }, 'asc');

    return bookings.map((booking) => toBookingResource(booking, userId));
  }

  public async mine(
    { scope, page, perPage }: MyBookingsDto,
    userId: string,
  ): Promise<Paginated<BookingResource>> {
    const now = new Date();
    const isUpcoming = scope === BookingScope.Upcoming;

    const { items, total } = await this.bookingRepository.paginate(
      { userId, ...(isUpcoming ? { endsAfter: now } : { endedBefore: now }) },
      page,
      perPage,
      isUpcoming ? 'asc' : 'desc',
    );

    return new Paginated(
      items.map((booking) => toBookingResource(booking, userId)),
      total,
      page,
      perPage,
    );
  }
}
