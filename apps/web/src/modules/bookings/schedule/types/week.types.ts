export interface WeekSlot {
  readonly start: Date;
  readonly end: Date;
}

export interface WeekDay {
  readonly date: Date;
  readonly label: string;
  readonly isToday: boolean;
}
