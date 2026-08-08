export interface CreateBookingDto {
  readonly roomId: string;
  readonly title: string;
  readonly startsAt: Date;
  readonly endsAt: Date;
}
