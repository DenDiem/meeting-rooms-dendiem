import { MILLISECONDS_PER_MINUTE } from '@common/constants/time.constants';

import type { IntervalDto } from '../dto/interval.dto';

export const durationInMinutes = ({ start, end }: IntervalDto): number =>
  (end.getTime() - start.getTime()) / MILLISECONDS_PER_MINUTE;

export const overlaps = (one: IntervalDto, other: IntervalDto): boolean =>
  one.start < other.end && other.start < one.end;
