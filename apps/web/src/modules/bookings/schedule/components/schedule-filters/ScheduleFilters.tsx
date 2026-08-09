import type { JSX } from 'react';

import type { Room } from '@domain/models/interfaces/room.interface';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { selectMinCapacity, setMinCapacity } from '@store/slices/filters.slice';

import { CAPACITY_OPTIONS } from './schedule-filters.constants';
import styles from './ScheduleFilters.module.scss';

interface ScheduleFiltersProps {
  readonly rooms: Room[];
  readonly roomId: string;
  readonly onSelectRoom: (roomId: string) => void;
}

export const ScheduleFilters = ({
  rooms,
  roomId,
  onSelectRoom,
}: ScheduleFiltersProps): JSX.Element => {
  const minCapacity = useAppSelector(selectMinCapacity);
  const dispatch = useAppDispatch();

  return (
    <div className={styles.filters}>
      <select
        className={styles.room}
        value={roomId}
        onChange={(event) => onSelectRoom(event.target.value)}
      >
        {rooms.map((room) => (
          <option key={room.id} value={room.id}>
            {room.name} · floor {room.floor} · {room.capacity} seats
          </option>
        ))}
      </select>

      <select
        className={styles.capacity}
        value={minCapacity ?? ''}
        onChange={(event) =>
          dispatch(setMinCapacity(event.target.value === '' ? null : Number(event.target.value)))
        }
      >
        <option value="">Any capacity</option>
        {CAPACITY_OPTIONS.map((capacity) => (
          <option key={capacity} value={capacity}>
            {capacity}+ seats
          </option>
        ))}
      </select>
    </div>
  );
};
