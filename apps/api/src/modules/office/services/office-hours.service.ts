import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  DEFAULT_OFFICE_CLOSE_HOUR,
  DEFAULT_OFFICE_OPEN_HOUR,
  DEFAULT_OFFICE_TIMEZONE,
} from '@config/config.constants';
import { readNumber } from '@config/read-number';

import type { OfficeHoursDto } from '../dto/office-hours.dto';

@Injectable()
export class OfficeHoursService {
  public readonly hours: OfficeHoursDto;

  constructor(configService: ConfigService) {
    this.hours = {
      timeZone: configService.get<string>('OFFICE_TIMEZONE') ?? DEFAULT_OFFICE_TIMEZONE,
      openHour: readNumber(configService.get('OFFICE_OPEN_HOUR'), DEFAULT_OFFICE_OPEN_HOUR),
      closeHour: readNumber(configService.get('OFFICE_CLOSE_HOUR'), DEFAULT_OFFICE_CLOSE_HOUR),
    };
  }
}
