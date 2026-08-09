import type { JSX } from 'react';
import { useState } from 'react';

import { Dialog, DialogActions } from '@components/dialog/Dialog';
import { StatusMessage } from '@components/status-message/StatusMessage';
import { TITLE_MAX_LENGTH } from '@domain/models/constants/booking.constants';
import { getErrorMessage } from '@domain/services/api-error.service';
import { useCreateBookingMutation } from '@store/api/booking.api';

import { formatLocalTime } from '../../services/week.service';
import type { WeekSlot } from '../../types/week.types';
import styles from './BookingDialog.module.scss';

interface BookingDialogProps {
  readonly roomId: string;
  readonly slot: WeekSlot;
  readonly onClose: () => void;
}

export const BookingDialog = ({ roomId, slot, onClose }: BookingDialogProps): JSX.Element => {
  const [title, setTitle] = useState('');
  const [createBooking, { isLoading, error }] = useCreateBookingMutation();

  const submit = async (): Promise<void> => {
    const result = await createBooking({
      roomId,
      title,
      startsAt: slot.start.toISOString(),
      endsAt: slot.end.toISOString(),
    });

    if (!('error' in result)) {
      onClose();
    }
  };

  return (
    <Dialog title="New booking">
      <p>
        {formatLocalTime(slot.start)} – {formatLocalTime(slot.end)}
      </p>

      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <label className={styles.field}>
          <span className={styles.label}>Title</span>
          <input
            type="text"
            value={title}
            maxLength={TITLE_MAX_LENGTH}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
        </label>

        {error && <StatusMessage tone="error">{getErrorMessage(error)}</StatusMessage>}

        <DialogActions>
          <button type="submit" disabled={isLoading || title.trim().length === 0}>
            {isLoading ? 'Booking…' : 'Book'}
          </button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
