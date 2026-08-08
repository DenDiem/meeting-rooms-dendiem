import { SLOT_TAKEN_MESSAGE } from '../constants/bookings.constants';

export class SlotTakenException extends Error {
  constructor() {
    super(SLOT_TAKEN_MESSAGE);
    this.name = 'SlotTakenException';
  }
}
