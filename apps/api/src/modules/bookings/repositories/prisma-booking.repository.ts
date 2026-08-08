import { Injectable } from '@nestjs/common';

import { PrismaService } from '@database/prisma.service';
import type { SortDirection } from '@common/types/sort.types';

import type { BookingFilterDto } from '../dto/booking-filter.dto';
import type { NewBookingDto } from '../dto/new-booking.dto';
import { SlotTakenException } from '../exceptions/slot-taken.exception';
import { toBookingDetailsModel, toBookingModel } from '../factories/booking.factory';
import { bookingFilters } from '../filters/booking.filters';
import { isOverlapViolation } from '../helpers/is-overlap-violation';
import type { BookingRepository, PagedBookings } from '../interfaces/booking-repository.interface';
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
      if (isOverlapViolation(error)) {
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
}
