import type { Room } from '@generated/prisma/client';

import type { RoomModel } from '../models/room.model';

export const toRoomModel = ({ id, name, floor, capacity }: Room): RoomModel => ({
  id,
  name,
  floor,
  capacity,
});
