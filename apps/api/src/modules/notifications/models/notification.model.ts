export interface EndingBookingModel {
  readonly id: string;
  readonly userId: string;
  readonly title: string;
  readonly endsAt: Date;
  readonly roomName: string;
  readonly nextBookingId: string;
}

export interface NotificationModel {
  readonly id: string;
  readonly userId: string;
  readonly title: string;
  readonly endsAt: Date;
  readonly roomName: string;
}
