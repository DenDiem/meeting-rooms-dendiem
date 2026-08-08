import { Injectable } from '@nestjs/common';

import { PrismaService } from '@database/prisma.service';

import type { RoomFilterDto } from '../dto/room-filter.dto';
import { toRoomModel } from '../factories/room.factory';
import { roomFilters } from '../filters/room.filters';
import type { RoomRepository } from '../interfaces/room-repository.interface';
import type { RoomModel } from '../models/room.model';

@Injectable()
export class PrismaRoomRepository implements RoomRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async findAll(filter: RoomFilterDto): Promise<RoomModel[]> {
    const rooms = await this.prismaService.room.findMany({
      where: roomFilters(filter),
      orderBy: [{ floor: 'asc' }, { name: 'asc' }],
    });

    return rooms.map(toRoomModel);
  }

  public async findById(id: RoomModel['id']): Promise<RoomModel | null> {
    const room = await this.prismaService.room.findUnique({ where: { id } });

    return room ? toRoomModel(room) : null;
  }
}
