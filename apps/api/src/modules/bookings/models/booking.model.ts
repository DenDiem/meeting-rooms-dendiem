export interface BookingModel {
  readonly id: string;
  readonly roomId: string;
  readonly userId: string;
  readonly title: string;
  readonly startsAt: Date;
  readonly endsAt: Date;
  readonly canceledAt: Date | null;
  readonly seriesId: string | null;
}

export interface BookingDetailsModel extends BookingModel {
  readonly room: { readonly id: string; readonly name: string };
  readonly user: { readonly id: string; readonly name: string };
}
