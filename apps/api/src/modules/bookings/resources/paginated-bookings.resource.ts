import type { BookingResource } from './booking.resource';

export interface PaginatedBookingsResource {
  readonly items: BookingResource[];
  readonly total: number;
  readonly page: number;
  readonly perPage: number;
}
