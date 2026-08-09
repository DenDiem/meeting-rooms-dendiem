import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

import { EMAIL_NOT_CONFIRMED_MESSAGE } from '../constants/auth.constants';
import type { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';

@Injectable()
export class ConfirmedEmailGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!user?.isEmailConfirmed) {
      throw new ForbiddenException(EMAIL_NOT_CONFIRMED_MESSAGE);
    }

    return true;
  }
}
