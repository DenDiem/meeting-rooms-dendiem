import { Injectable } from '@nestjs/common';

import type { SortDirection } from '@common/types/sort.types';
import { isConstraintViolation } from '@database/is-constraint-violation';
import { EXCLUSION_VIOLATION_CODE } from '@database/prisma-error.constants';
import { PrismaService } from '@database/prisma.service';

import { OVERLAP_CONSTRAINT_NAME } from '../constants/bookings.constants';
import type { BookingFilterDto } from '../dto/booking-filter.dto';
import type { NewBookingSeriesDto } from '../dto/new-booking-series.dto';
import type { NewBookingDto } from '../dto/new-booking.dto';
import { SlotTakenException } from '../exceptions/slot-taken.exception';
import { toBookingSeriesModel } from '../factories/booking-series.factory';
import { toBookingDetailsModel, toBookingModel } from '../factories/booking.factory';
import { bookingFilters } from '../filters/booking.filters';
import type { BookingRepository, PagedBookings } from '../interfaces/booking-repository.interface';
import type { BookingSeriesModel } from '../models/booking-series.model';
import type { BookingDetailsModel, BookingModel } from '../models/booking.model';

const withRoomAndUser = {
  room: { select: { id: true, name: true } },
  user: { select: { id: true, name: true } },
};

@Injectable()
export class PrismaBookingRepository implements BookingRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(booking: NewBookingDto): Promise<BookingDetailsModel> {
    try {
      return toBookingDetailsModel(
        await this.prismaService.booking.create({ data: booking, include: withRoomAndUser }),
      );
    } catch (error) {
      if (isConstraintViolation(error, EXCLUSION_VIOLATION_CODE, OVERLAP_CONSTRAINT_NAME)) {
        throw new SlotTakenException();
      }

      throw error;
    }
  }

  public async createSeries(
    series: NewBookingSeriesDto,
    occurrences: readonly NewBookingDto[],
  ): Promise<BookingDetailsModel[]> {
    try {
      return await this.prismaService.$transaction(async (transaction) => {
        const { id: seriesId } = await transaction.bookingSeries.create({ data: series });
        const created: BookingDetailsModel[] = [];

        for (const occurrence of occurrences) {
          created.push(
            toBookingDetailsModel(
              await transaction.booking.create({
                data: { ...occurrence, seriesId },
                include: withRoomAndUser,
              }),
            ),
          );
        }

        return created;
      });
    } catch (error) {
      if (isConstraintViolation(error, EXCLUSION_VIOLATION_CODE, OVERLAP_CONSTRAINT_NAME)) {
        throw new SlotTakenException();
      }

      throw error;
    }
  }

  public async findById(id: BookingModel['id']): Promise<BookingModel | null> {
    const booking = await this.prismaService.booking.findUnique({ where: { id } });

    return booking ? toBookingModel(booking) : null;
  }

  public async findFirst(filter: BookingFilterDto): Promise<BookingModel | null> {
    const booking = await this.prismaService.booking.findFirst({ where: bookingFilters(filter) });

    return booking ? toBookingModel(booking) : null;
  }

  public async findMany(
    filter: BookingFilterDto,
    sort: SortDirection,
  ): Promise<BookingDetailsModel[]> {
    const bookings = await this.prismaService.booking.findMany({
      where: bookingFilters(filter),
      include: withRoomAndUser,
      orderBy: { startsAt: sort },
    });

    return bookings.map(toBookingDetailsModel);
  }

  public async paginate(
    filter: BookingFilterDto,
    page: number,
    perPage: number,
    sort: SortDirection,
  ): Promise<PagedBookings> {
    const where = bookingFilters(filter);

    const [items, total] = await Promise.all([
      this.prismaService.booking.findMany({
        where,
        include: withRoomAndUser,
        orderBy: { startsAt: sort },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prismaService.booking.count({ where }),
    ]);

    return { items: items.map(toBookingDetailsModel), total };
  }

  public async cancel(id: BookingModel['id'], canceledAt: Date): Promise<void> {
    await this.prismaService.booking.update({ where: { id }, data: { canceledAt } });
  }

  public async findSeriesById(id: BookingSeriesModel['id']): Promise<BookingSeriesModel | null> {
    const series = await this.prismaService.bookingSeries.findUnique({ where: { id } });

    return series ? toBookingSeriesModel(series) : null;
  }

  public async cancelSeries(
    seriesId: BookingSeriesModel['id'],
    canceledAt: Date,
    startingFrom: Date,
  ): Promise<number> {
    const { count } = await this.prismaService.booking.updateMany({
      where: { seriesId, canceledAt: null, startsAt: { gte: startingFrom } },
      data: { canceledAt },
    });

    return count;
  }
}
