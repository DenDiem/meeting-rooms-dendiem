import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import type { ZodType } from 'zod';

import { VALIDATION_FAILED_MESSAGE } from '../constants/validation.constants';
import { toFieldErrors } from '../helpers/to-field-errors';

@Injectable()
export class ZodValidationPipe<TOutput> implements PipeTransform<unknown, TOutput> {
  constructor(private readonly schema: ZodType<TOutput>) {}

  public transform(value: unknown): TOutput {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      throw new BadRequestException({
        message: VALIDATION_FAILED_MESSAGE,
        fields: toFieldErrors(result.error),
      });
    }

    return result.data;
  }
}
