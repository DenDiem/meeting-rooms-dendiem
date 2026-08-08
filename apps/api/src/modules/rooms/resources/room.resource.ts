import type { RoomModel } from '../models/room.model';

export interface RoomResource {
  readonly id: string;
  readonly name: string;
  readonly floor: number;
  readonly capacity: number;
}

export const toRoomResource = ({ id, name, floor, capacity }: RoomModel): RoomResource => ({
  id,
  name,
  floor,
  capacity,
});
