import { Controller, Get, UseGuards } from '@nestjs/common';

import { SessionGuard } from '@modules/auth/guards/session.guard';

import { toOfficeResource, type OfficeResource } from '../resources/office.resource';
import { OfficeHoursService } from '../services/office-hours.service';

@Controller('office')
@UseGuards(SessionGuard)
export class OfficeController {
  constructor(private readonly officeHoursService: OfficeHoursService) {}

  @Get()
  public read(): OfficeResource {
    return toOfficeResource(this.officeHoursService.hours);
  }
}
