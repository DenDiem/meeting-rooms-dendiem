import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

import { MILLISECONDS_PER_DAY } from '@common/constants/time.constants';
import { DEFAULT_SESSION_TTL_DAYS } from '@config/config.constants';

import { createSessionToken, hashSessionToken } from '../helpers/session-token';
import {
  SESSION_REPOSITORY,
  type SessionRepository,
} from '../interfaces/session-repository.interface';
import { toPublicUserResource, type PublicUserResource } from '../resources/public-user.resource';
import { SessionCookieService } from './session-cookie.service';

@Injectable()
export class SessionService {
  private readonly ttlDays: number;

  constructor(
    @Inject(SESSION_REPOSITORY) private readonly sessionRepository: SessionRepository,
    private readonly sessionCookieService: SessionCookieService,
    configService: ConfigService,
  ) {
    this.ttlDays = Number(configService.get('SESSION_TTL_DAYS') ?? DEFAULT_SESSION_TTL_DAYS);
  }

  public async start(userId: PublicUserResource['id']): Promise<string> {
    const token = createSessionToken();

    await this.sessionRepository.create({
      userId,
      tokenHash: hashSessionToken(token),
      expiresAt: new Date(Date.now() + this.ttlDays * MILLISECONDS_PER_DAY),
    });

    return token;
  }

  public async resolve(request: Request): Promise<PublicUserResource | null> {
    const token = this.sessionCookieService.read(request);

    if (!token) {
      return null;
    }

    const session = await this.sessionRepository.findActiveByTokenHash(
      hashSessionToken(token),
      new Date(),
    );

    return session ? toPublicUserResource(session.user) : null;
  }

  public async end(request: Request): Promise<void> {
    const token = this.sessionCookieService.read(request);

    if (token) {
      await this.sessionRepository.revokeByTokenHash(hashSessionToken(token), new Date());
    }
  }
}
