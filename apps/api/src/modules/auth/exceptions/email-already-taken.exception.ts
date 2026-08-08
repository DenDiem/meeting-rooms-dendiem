import { EMAIL_ALREADY_TAKEN_MESSAGE } from '../constants/auth.constants';

export class EmailAlreadyTakenException extends Error {
  constructor() {
    super(EMAIL_ALREADY_TAKEN_MESSAGE);
    this.name = 'EmailAlreadyTakenException';
  }
}
