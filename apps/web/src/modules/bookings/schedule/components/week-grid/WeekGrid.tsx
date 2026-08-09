import type { JSX, PointerEvent } from 'react';
import { useEffect, useState } from 'react';

import type { Booking } from '@domain/models/interfaces/booking.interface';
import type { OfficeHours } from '@domain/models/interfaces/office.interface';
import { classNames } from '@domain/services/class-names.service';

import {
  extendSelection,
  isInsideSelection,
  selectionBounds,
  selectionToSlot,
} from '../../services/slot-selection.service';
import { formatLocalTime } from '../../../services/booking-format.service';
import { officeDaySlots, officeWeekDays } from '../../services/week.service';
import { buildWeekRows } from '../../services/week-grid.service';
import type { SlotSelection, WeekCell, WeekSlot } from '../../types/week.types';
import styles from './WeekGrid.module.scss';

interface WeekGridProps {
  readonly week: string;
  readonly officeHours: OfficeHours;
  readonly bookings: Booking[];
  readonly isUpdating: boolean;
  readonly onSelectSlot: (slot: WeekSlot) => void;
  readonly onSelectBooking: (booking: Booking) => void;
}

const cellClass = (cell: WeekCell, isSelected: boolean): string =>
  classNames(
    styles.slot,
    cell.booking === null && (cell.isPast ? styles.past : styles.free),
    cell.booking !== null && (cell.booking.isMine ? styles.mine : styles.taken),
    cell.booking !== null && !cell.isBookingEnd && styles.continues,
    isSelected && styles.selected,
  );

export const WeekGrid = ({
  week,
  officeHours,
  bookings,
  isUpdating,
  onSelectSlot,
  onSelectBooking,
}: WeekGridProps): JSX.Element => {
  const [selection, setSelection] = useState<SlotSelection | null>(null);

  const days = officeWeekDays(week, officeHours);
  const weekSlots = days.map((day) => officeDaySlots(day.date, officeHours));
  const now = new Date();
  const rows = buildWeekRows(weekSlots, bookings, now);

  const selectedDaySlots = selection === null ? undefined : weekSlots[selection.dayIndex];
  const selectedSlot =
    selection === null || selectedDaySlots === undefined
      ? null
      : selectionToSlot(selection, selectedDaySlots);
  const bounds = selection === null ? null : selectionBounds(selection);

  useEffect(() => {
    if (selection === null) {
      return;
    }

    const commit = (): void => {
      setSelection(null);

      if (selection.anchorIndex !== selection.headIndex && selectedSlot !== null) {
        onSelectSlot(selectedSlot);
      }
    };

    window.addEventListener('pointerup', commit);

    return () => window.removeEventListener('pointerup', commit);
  }, [selection, selectedSlot, onSelectSlot]);

  const startSelection = (event: PointerEvent<HTMLDivElement>, cell: WeekCell): void => {
    if (event.pointerType === 'touch' || cell.isPast || cell.booking !== null) {
      return;
    }

    setSelection({
      dayIndex: cell.dayIndex,
      anchorIndex: cell.rowIndex,
      headIndex: cell.rowIndex,
    });
  };

  const dragOver = (cell: WeekCell): void => {
    if (selection === null || selection.dayIndex !== cell.dayIndex) {
      return;
    }

    const daySlots = weekSlots[cell.dayIndex];

    if (daySlots !== undefined) {
      setSelection(extendSelection(selection, cell.rowIndex, daySlots, bookings, now));
    }
  };

  return (
    <div className={classNames(styles.wrapper, isUpdating && styles.updating)}>
      <div className={styles.scroll}>
        <div className={styles.grid}>
          <span className={styles.corner} />

          {days.map((day) => (
            <span
              key={day.label}
              className={classNames(styles.head, day.isToday && styles.headToday)}
            >
              <span className={styles.weekday}>{day.weekday}</span>
              <span className={styles.date}>{day.label}</span>
            </span>
          ))}

          {rows.map((row) => (
            <div key={row.key} className={styles.row}>
              <span className={styles.time}>{row.isHourStart ? row.time : ''}</span>

              {row.cells.map((cell) => {
                const { booking } = cell;

                return (
                  <div
                    key={cell.key}
                    className={classNames(
                      cellClass(cell, isInsideSelection(selection, cell.dayIndex, cell.rowIndex)),
                      row.isHourEnd && styles.hourEnd,
                    )}
                    onPointerDown={(event) => startSelection(event, cell)}
                    onPointerEnter={() => dragOver(cell)}
                  >
                    {booking === null ? (
                      <button
                        type="button"
                        className={styles.action}
                        disabled={cell.isPast}
                        onClick={() => onSelectSlot(cell.slot)}
                      >
                        <span className={styles.hint}>Book</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className={styles.action}
                        onClick={() => onSelectBooking(booking)}
                      >
                        {cell.isBookingStart && (
                          <>
                            <span className={styles.title}>{booking.title}</span>
                            <span className={styles.author}>{booking.user.name}</span>
                          </>
                        )}
                      </button>
                    )}

                    {cell.nowOffset !== null && (
                      <span className={styles.now} style={{ top: `${cell.nowOffset * 100}%` }} />
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {selection !== null && selectedSlot !== null && bounds !== null && (
            <span
              className={styles.selectionOutline}
              style={{
                gridColumn: `${selection.dayIndex + 2} / ${selection.dayIndex + 3}`,
                gridRow: `${bounds.firstIndex + 2} / ${bounds.lastIndex + 3}`,
              }}
            >
              {formatLocalTime(selectedSlot.start)} – {formatLocalTime(selectedSlot.end)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
