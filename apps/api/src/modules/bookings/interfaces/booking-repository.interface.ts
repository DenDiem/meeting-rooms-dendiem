import type { SortDirection } from '@common/types/sort.types';

import type { BookingFilterDto } from '../dto/booking-filter.dto';
import type { NewBookingSeriesDto } from '../dto/new-booking-series.dto';
import type { NewBookingDto } from '../dto/new-booking.dto';
import type { BookingSeriesModel } from '../models/booking-series.model';
import type { BookingDetailsModel, BookingModel } from '../models/booking.model';

export const BOOKING_REPOSITORY = Symbol('BookingRepository');

export interface PagedBookings {
  readonly items: BookingDetailsModel[];
  readonly total: number;
}

export interface BookingRepository {
  create(booking: NewBookingDto): Promise<BookingDetailsModel>;
  createSeries(
    series: NewBookingSeriesDto,
    occurrences: readonly NewBookingDto[],
  ): Promise<BookingDetailsModel[]>;
  findById(id: BookingModel['id']): Promise<BookingModel | null>;
  findFirst(filter: BookingFilterDto): Promise<BookingModel | null>;
  findMany(filter: BookingFilterDto, sort: SortDirection): Promise<BookingDetailsModel[]>;
  paginate(
    filter: BookingFilterDto,
    page: number,
    perPage: number,
    sort: SortDirection,
  ): Promise<PagedBookings>;
  cancel(id: BookingModel['id'], canceledAt: Date): Promise<void>;
  findSeriesById(id: BookingSeriesModel['id']): Promise<BookingSeriesModel | null>;
  cancelSeries(
    seriesId: BookingSeriesModel['id'],
    canceledAt: Date,
    startingFrom: Date,
  ): Promise<number>;
}
