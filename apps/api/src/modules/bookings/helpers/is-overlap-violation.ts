import { OVERLAP_CONSTRAINT_NAME } from '../constants/bookings.constants';

export const isOverlapViolation = (error: unknown): boolean =>
  error instanceof Error && error.message.includes(OVERLAP_CONSTRAINT_NAME);
