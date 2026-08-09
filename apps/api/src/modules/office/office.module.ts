import { Module } from '@nestjs/common';

import { AuthModule } from '@modules/auth/auth.module';

import { OfficeController } from './controllers/office.controller';
import { OfficeHoursService } from './services/office-hours.service';

@Module({
  imports: [AuthModule],
  controllers: [OfficeController],
  providers: [OfficeHoursService],
  exports: [OfficeHoursService],
})
export class OfficeModule {}
