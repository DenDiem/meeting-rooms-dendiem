import type { JSX } from 'react';
import { useState } from 'react';

import { Button } from '@components/button/Button';
import { Dialog, DialogActions, DialogBody } from '@components/dialog/Dialog';
import { FormField } from '@components/form-field/FormField';
import { StatusMessage } from '@components/status-message/StatusMessage';
import {
  MAX_BOOKING_MINUTES,
  MIN_BOOKING_MINUTES,
  TITLE_MAX_LENGTH,
} from '@domain/models/constants/booking.constants';
import type { Booking } from '@domain/models/interfaces/booking.interface';
import type { OfficeHours } from '@domain/models/interfaces/office.interface';
import { getErrorMessage } from '@domain/services/api-error.service';
import { useCreateBookingMutation, useCreateBookingSeriesMutation } from '@store/api/booking.api';

import { availableEndTimes, freeStartTimes } from '../../services/booking-options.service';
import { durationInMinutes, formatDuration } from '../../services/duration.service';
import { formatLocalDate, formatLocalTime } from '../../../services/booking-format.service';
import { officeDaySlots } from '../../services/week.service';
import type { WeekSlot } from '../../types/week.types';
import { DEFAULT_REPEATS, REPEAT_OPTIONS } from './booking-dialog.constants';
import styles from './BookingDialog.module.scss';

interface BookingDialogProps {
  readonly roomId: string;
  readonly officeHours: OfficeHours;
  readonly slot: WeekSlot;
  readonly bookings: Booking[];
  readonly onClose: () => void;
}

export const BookingDialog = ({
  roomId,
  officeHours,
  slot,
  bookings,
  onClose,
}: BookingDialogProps): JSX.Element => {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState(slot.start);
  const [end, setEnd] = useState(slot.end);
  const [repeats, setRepeats] = useState<number | null>(null);
  const [createBooking, { isLoading: isBooking, error: bookingError }] = useCreateBookingMutation();
  const [createSeries, { isLoading: isRepeating, error: seriesError }] =
    useCreateBookingSeriesMutation();

  const isLoading = isBooking || isRepeating;
  const error = bookingError ?? seriesError;

  const daySlots = officeDaySlots(slot.start, officeHours);
  const starts = freeStartTimes(daySlots, bookings, new Date());
  const ends = availableEndTimes(start, daySlots, bookings);
  const duration = durationInMinutes(start, end);

  const changeStart = (value: string): void => {
    const nextStart = new Date(value);
    const nextEnds = availableEndTimes(nextStart, daySlots, bookings);
    const nextEnd = nextEnds[0];

    setStart(nextStart);

    if (nextEnd !== undefined) {
      setEnd(nextEnd);
    }
  };

  const submit = async (): Promise<void> => {
    const payload = {
      roomId,
      title,
      startsAt: start.toISOString(),
      endsAt: end.toISOString(),
    };

    const result =
      repeats === null ? await createBooking(payload) : await createSeries({ ...payload, repeats });

    if (!('error' in result)) {
      onClose();
    }
  };

  const submitLabel = repeats === null ? 'Book' : `Book ${repeats} weeks`;

  return (
    <Dialog title="New booking" description={formatLocalDate(start)} onDismiss={onClose}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <DialogBody>
          <FormField label="Title">
            <input
              type="text"
              value={title}
              maxLength={TITLE_MAX_LENGTH}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
          </FormField>

          <div className={styles.range}>
            <FormField label="Start">
              <select
                value={start.toISOString()}
                onChange={(event) => changeStart(event.target.value)}
              >
                {starts.map((option) => (
                  <option key={option.toISOString()} value={option.toISOString()}>
                    {formatLocalTime(option)}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="End">
              <select
                value={end.toISOString()}
                onChange={(event) => setEnd(new Date(event.target.value))}
              >
                {ends.map((option) => (
                  <option key={option.toISOString()} value={option.toISOString()}>
                    {formatLocalTime(option)}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <div className={styles.repeat}>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={repeats !== null}
                onChange={(event) => setRepeats(event.target.checked ? DEFAULT_REPEATS : null)}
              />
              Repeat weekly
            </label>

            {repeats !== null && (
              <select
                className={styles.repeats}
                value={repeats}
                onChange={(event) => setRepeats(Number(event.target.value))}
              >
                {REPEAT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option} weeks
                  </option>
                ))}
              </select>
            )}
          </div>

          <span className={styles.hint}>
            {formatDuration(duration)} · from {MIN_BOOKING_MINUTES} minutes to{' '}
            {formatDuration(MAX_BOOKING_MINUTES)}
          </span>

          {error !== undefined && (
            <StatusMessage tone="error">{getErrorMessage(error)}</StatusMessage>
          )}
        </DialogBody>

        <DialogActions>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading || title.trim().length === 0}>
            {isLoading ? 'Booking…' : submitLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
