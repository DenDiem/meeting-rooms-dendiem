import type { BookingScope } from '../enums/booking-scope.enum';

export interface MyBookingsDto {
  readonly scope: BookingScope;
  readonly page: number;
  readonly perPage: number;
}
