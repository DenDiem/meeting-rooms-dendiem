export interface NewBookingDto {
  readonly roomId: string;
  readonly userId: string;
  readonly title: string;
  readonly startsAt: Date;
  readonly endsAt: Date;
}
