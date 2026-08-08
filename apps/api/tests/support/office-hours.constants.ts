import type { OfficeHoursDto } from '@modules/bookings/dto/office-hours.dto';

export const KYIV_OFFICE: OfficeHoursDto = {
  timeZone: 'Europe/Kyiv',
  openHour: 9,
  closeHour: 19,
};

export const KATHMANDU_OFFICE: OfficeHoursDto = {
  timeZone: 'Asia/Kathmandu',
  openHour: 9,
  closeHour: 19,
};

export const UNKNOWN_OFFICE: OfficeHoursDto = {
  timeZone: 'Mars/Olympus',
  openHour: 9,
  closeHour: 19,
};
