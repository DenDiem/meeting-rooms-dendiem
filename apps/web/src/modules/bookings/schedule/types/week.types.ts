import type { Booking } from '@domain/models/interfaces/booking.interface';

export interface WeekSlot {
  readonly start: Date;
  readonly end: Date;
}

export interface WeekDay {
  readonly date: Date;
  readonly label: string;
  readonly weekday: string;
  readonly isToday: boolean;
}

export interface WeekCell {
  readonly key: string;
  readonly slot: WeekSlot;
  readonly dayIndex: number;
  readonly rowIndex: number;
  readonly booking: Booking | null;
  readonly isPast: boolean;
  readonly isBookingStart: boolean;
  readonly isBookingEnd: boolean;
  readonly nowOffset: number | null;
}

export interface SlotSelection {
  readonly dayIndex: number;
  readonly anchorIndex: number;
  readonly headIndex: number;
}

export interface WeekRow {
  readonly key: string;
  readonly time: string;
  readonly isHourStart: boolean;
  readonly isHourEnd: boolean;
  readonly cells: WeekCell[];
}
