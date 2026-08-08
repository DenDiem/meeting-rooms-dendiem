import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';

import { NOT_SIGNED_IN_MESSAGE } from '../constants/auth.constants';
import type { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';
import type { PublicUserResource } from '../resources/public-user.resource';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): PublicUserResource => {
    const { user } = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!user) {
      throw new UnauthorizedException(NOT_SIGNED_IN_MESSAGE);
    }

    return user;
  },
);
