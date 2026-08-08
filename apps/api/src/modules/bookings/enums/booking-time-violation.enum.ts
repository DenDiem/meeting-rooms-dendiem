export enum BookingTimeViolation {
  EndNotAfterStart = 'END_NOT_AFTER_START',
  TooShort = 'TOO_SHORT',
  TooLong = 'TOO_LONG',
  NotAlignedToSlot = 'NOT_ALIGNED_TO_SLOT',
  InThePast = 'IN_THE_PAST',
  OutsideOfficeHours = 'OUTSIDE_OFFICE_HOURS',
}
