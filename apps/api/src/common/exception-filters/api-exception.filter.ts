import {
  Catch,
  HttpException,
  HttpStatus,
  Logger,
  type ArgumentsHost,
  type ExceptionFilter,
} from '@nestjs/common';
import type { Response } from 'express';

import { UNEXPECTED_ERROR_MESSAGE } from '../constants/error.constants';
import type { ApiErrorBody } from '../types/api-error.types';

const readMessage = (response: object): string => {
  if (!('message' in response)) {
    return UNEXPECTED_ERROR_MESSAGE;
  }

  const { message } = response;

  if (typeof message === 'string') {
    return message;
  }

  if (Array.isArray(message)) {
    return message.filter((item) => typeof item === 'string').join(' ');
  }

  return UNEXPECTED_ERROR_MESSAGE;
};

const readFields = (response: object): Record<string, string> | undefined => {
  if (!('fields' in response)) {
    return undefined;
  }

  const { fields } = response;

  if (typeof fields !== 'object' || fields === null) {
    return undefined;
  }

  const collected: Record<string, string> = {};

  for (const [field, message] of Object.entries(fields)) {
    if (typeof message === 'string') {
      collected[field] = message;
    }
  }

  return Object.keys(collected).length > 0 ? collected : undefined;
};

const toErrorBody = (exception: HttpException): ApiErrorBody => {
  const response = exception.getResponse();

  if (typeof response === 'string') {
    return { message: response };
  }

  const fields = readFields(response);

  return fields === undefined
    ? { message: readMessage(response) }
    : { message: readMessage(response), fields };
};

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  public catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({ errors: toErrorBody(exception) });

      return;
    }

    this.logger.error(exception);

    response
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ errors: { message: UNEXPECTED_ERROR_MESSAGE } });
  }
}
