import type { IntervalDto } from './interval.dto';

export interface BookingFilterDto {
  readonly roomId?: string;
  readonly userId?: string;
  readonly overlapping?: IntervalDto;
  readonly endsAfter?: Date;
  readonly endedBefore?: Date;
}
