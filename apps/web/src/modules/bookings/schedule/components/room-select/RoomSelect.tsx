import type { JSX } from 'react';

import type { Room } from '@domain/models/interfaces/room.interface';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { selectMinCapacity, setMinCapacity } from '@store/slices/filters.slice';

import styles from './RoomSelect.module.scss';

const CAPACITY_OPTIONS = [4, 6, 10, 14, 20];

interface RoomSelectProps {
  readonly rooms: Room[];
  readonly roomId: string;
  readonly onSelectRoom: (roomId: string) => void;
}

export const RoomSelect = ({ rooms, roomId, onSelectRoom }: RoomSelectProps): JSX.Element => {
  const minCapacity = useAppSelector(selectMinCapacity);
  const dispatch = useAppDispatch();

  return (
    <div className={styles.filters}>
      <select value={roomId} onChange={(event) => onSelectRoom(event.target.value)}>
        {rooms.map((room) => (
          <option key={room.id} value={room.id}>
            {room.name} · floor {room.floor} · {room.capacity} seats
          </option>
        ))}
      </select>

      <select
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
