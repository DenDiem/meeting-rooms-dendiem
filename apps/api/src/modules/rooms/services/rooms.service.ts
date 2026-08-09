import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { ROOM_NOT_FOUND_MESSAGE } from '../constants/rooms.constants';
import type { RoomFilterDto } from '../dto/room-filter.dto';
import { ROOM_REPOSITORY, type RoomRepository } from '../interfaces/room-repository.interface';
import type { RoomModel } from '../models/room.model';
import { toRoomResource, type RoomResource } from '../resources/room.resource';

@Injectable()
export class RoomsService {
  constructor(@Inject(ROOM_REPOSITORY) private readonly roomRepository: RoomRepository) {}

  public async list(filter: RoomFilterDto): Promise<RoomResource[]> {
    const rooms = await this.roomRepository.findAll(filter);

    return rooms.map(toRoomResource);
  }

  public async ensureExists(id: RoomModel['id']): Promise<void> {
    if (!(await this.roomRepository.findById(id))) {
      throw new NotFoundException(ROOM_NOT_FOUND_MESSAGE);
    }
  }
}
