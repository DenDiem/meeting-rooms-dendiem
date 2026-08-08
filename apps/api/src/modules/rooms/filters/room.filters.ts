import { Filters } from '@common/filters/filters';
import type { Prisma } from '@generated/prisma/client';

import type { RoomFilterDto } from '../dto/room-filter.dto';

export const roomFilters = ({ minCapacity }: RoomFilterDto): Prisma.RoomWhereInput =>
  Filters.init<Prisma.RoomWhereInput>()
    .when(minCapacity, (capacity) => ({ capacity: { gte: capacity } }))
    .build();
