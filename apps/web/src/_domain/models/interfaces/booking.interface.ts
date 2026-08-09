import type { BookingScope } from '../enums/booking-scope.enum';

export interface Booking {
  readonly id: string;
  readonly title: string;
  readonly startsAt: string;
  readonly endsAt: string;
  readonly room: { readonly id: string; readonly name: string };
  readonly user: { readonly id: string; readonly name: string };
  readonly isMine: boolean;
  readonly seriesId: string | null;
}

export interface PaginatedBookings {
  readonly items: Booking[];
  readonly total: number;
  readonly perPage: number;
}

export interface CreateBookingPayload {
  readonly roomId: string;
  readonly title: string;
  readonly startsAt: string;
  readonly endsAt: string;
}

export interface CreateBookingSeriesPayload extends CreateBookingPayload {
  readonly repeats: number;
}

export interface WeekScheduleQuery {
  readonly roomId: string;
  readonly week: string;
}

export interface MyBookingsQuery {
  readonly scope: BookingScope;
  readonly page: number;
  readonly perPage: number;
}
