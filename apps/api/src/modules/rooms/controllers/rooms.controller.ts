import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';
import { SessionGuard } from '@modules/auth/guards/session.guard';

import type { RoomFilterDto } from '../dto/room-filter.dto';
import { roomFilterRequestSchema } from '../requests/room-filter.request';
import type { RoomResource } from '../resources/room.resource';
import { RoomsService } from '../services/rooms.service';

@Controller('rooms')
@UseGuards(SessionGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  public list(
    @Query(new ZodValidationPipe(roomFilterRequestSchema)) filter: RoomFilterDto,
  ): Promise<RoomResource[]> {
    return this.roomsService.list(filter);
  }
}
