import type { RoomFilterDto } from '../dto/room-filter.dto';
import type { RoomModel } from '../models/room.model';

export const ROOM_REPOSITORY = Symbol('RoomRepository');

export interface RoomRepository {
  findAll(filter: RoomFilterDto): Promise<RoomModel[]>;
  findById(id: RoomModel['id']): Promise<RoomModel | null>;
}
