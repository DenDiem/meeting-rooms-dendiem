import type { OfficeHoursDto } from '../dto/office-hours.dto';

export interface OfficeResource {
  readonly timeZone: string;
  readonly openHour: number;
  readonly closeHour: number;
}

export const toOfficeResource = ({
  timeZone,
  openHour,
  closeHour,
}: OfficeHoursDto): OfficeResource => ({ timeZone, openHour, closeHour });
