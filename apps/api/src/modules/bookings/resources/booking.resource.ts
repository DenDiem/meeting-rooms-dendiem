import type { BookingDetailsModel } from '../models/booking.model';

export interface BookingResource {
  readonly id: string;
  readonly title: string;
  readonly startsAt: string;
  readonly endsAt: string;
  readonly room: { readonly id: string; readonly name: string };
  readonly user: { readonly id: string; readonly name: string };
  readonly isMine: boolean;
  readonly seriesId: string | null;
}

export const toBookingResource = (
  booking: BookingDetailsModel,
  currentUserId: string,
): BookingResource => ({
  id: booking.id,
  title: booking.title,
  startsAt: booking.startsAt.toISOString(),
  endsAt: booking.endsAt.toISOString(),
  room: booking.room,
  user: booking.user,
  isMine: booking.userId === currentUserId,
  seriesId: booking.seriesId,
});
