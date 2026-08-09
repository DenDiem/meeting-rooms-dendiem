export interface CreateBookingSeriesDto {
  readonly roomId: string;
  readonly title: string;
  readonly startsAt: Date;
  readonly endsAt: Date;
  readonly repeats: number;
}
