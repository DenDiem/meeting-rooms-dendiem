import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { NOT_SIGNED_IN_MESSAGE } from '../constants/auth.constants';
import type { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';
import { SessionService } from '../services/session.service';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = await this.sessionService.resolve(request);

    if (!user) {
      throw new UnauthorizedException(NOT_SIGNED_IN_MESSAGE);
    }

    request.user = user;

    return true;
  }
}
