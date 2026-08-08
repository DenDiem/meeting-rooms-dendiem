import { MILLISECONDS_PER_MINUTE } from '@common/constants/time.constants';

import type { IntervalDto } from '../dto/interval.dto';

export const durationInMinutes = ({ start, end }: IntervalDto): number =>
  (end.getTime() - start.getTime()) / MILLISECONDS_PER_MINUTE;

export const overlaps = (a: IntervalDto, b: IntervalDto): boolean =>
  a.start < b.end && b.start < a.end;
