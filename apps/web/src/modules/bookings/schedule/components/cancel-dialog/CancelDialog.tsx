import type { JSX } from 'react';

import { StatusMessage } from '@components/feedback/status-message/StatusMessage';
import { Dialog, DialogActions } from '@components/overlay/dialog/Dialog';
import type { Booking } from '@domain/models/interfaces/booking.interface';
import { getErrorMessage } from '@domain/services/api-error.service';
import { useCancelBookingMutation } from '@store/api/booking.api';

import { formatLocalDateTime } from '../../services/week.service';

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
    <Dialog title={booking.title}>
      <p>
        {formatLocalDateTime(booking.startsAt)} – {formatLocalDateTime(booking.endsAt)}
      </p>
      <p>
        {booking.room.name} · booked by {booking.user.name}
      </p>

      {error && <StatusMessage tone="error">{getErrorMessage(error)}</StatusMessage>}

      <DialogActions>
        {booking.isMine && (
          <button type="button" disabled={isLoading} onClick={() => void submit()}>
            {isLoading ? 'Cancelling…' : 'Cancel booking'}
          </button>
        )}
        <button type="button" onClick={onClose}>
          Close
        </button>
      </DialogActions>
    </Dialog>
  );
};
