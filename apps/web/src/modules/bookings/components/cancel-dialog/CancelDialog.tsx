import type { JSX } from 'react';

import { Button } from '@components/button/Button';
import { Dialog, DialogActions, DialogBody } from '@components/dialog/Dialog';
import { StatusMessage } from '@components/status-message/StatusMessage';
import type { Booking } from '@domain/models/interfaces/booking.interface';
import { getErrorMessage } from '@domain/services/api-error.service';
import { useCancelBookingMutation } from '@store/api/booking.api';

import { formatLocalDayAndTime } from '../../services/booking-format.service';
import styles from './CancelDialog.module.scss';

interface CancelDialogProps {
  readonly booking: Booking;
  readonly onClose: () => void;
}

export const CancelDialog = ({ booking, onClose }: CancelDialogProps): JSX.Element => {
  const [cancelBooking, { isLoading, error }] = useCancelBookingMutation();

  const submit = async (): Promise<void> => {
    const result = await cancelBooking(booking.id);

    if (!('error' in result)) {
      onClose();
    }
  };

  return (
    <Dialog
      title={booking.isMine ? 'Cancel this booking?' : booking.title}
      description={`${booking.title} · ${formatLocalDayAndTime(new Date(booking.startsAt), new Date(booking.endsAt))}`}
      onDismiss={onClose}
    >
      <DialogBody>
        <span className={styles.details}>
          {booking.room.name} · booked by {booking.user.name}
        </span>

        {booking.isMine && (
          <span className={styles.details}>
            The slot becomes free for everyone. This cannot be undone.
          </span>
        )}

        {error !== undefined && (
          <StatusMessage tone="error">{getErrorMessage(error)}</StatusMessage>
        )}
      </DialogBody>

      <DialogActions>
        <Button onClick={onClose}>{booking.isMine ? 'Keep it' : 'Close'}</Button>
        {booking.isMine && (
          <Button variant="danger" disabled={isLoading} onClick={() => void submit()}>
            {isLoading ? 'Cancelling…' : 'Cancel booking'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
