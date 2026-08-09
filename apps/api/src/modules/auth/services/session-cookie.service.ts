import { Inject, Injectable } from '@nestjs/common';
import type { CookieOptions, Request, Response } from 'express';

import { MILLISECONDS_PER_DAY } from '@common/constants/time.constants';

import { SESSION_CONFIG, type SessionConfig } from '../interfaces/session-config.interface';

@Injectable()
export class SessionCookieService {
  private readonly name: string;
  private readonly options: CookieOptions;

  constructor(@Inject(SESSION_CONFIG) sessionConfig: SessionConfig) {
    this.name = sessionConfig.cookieName;
    this.options = {
      httpOnly: true,
      sameSite: 'lax',
      secure: sessionConfig.cookieSecure,
      path: '/',
      maxAge: sessionConfig.ttlDays * MILLISECONDS_PER_DAY,
    };
  }

  public set(response: Response, token: string): void {
    response.cookie(this.name, token, this.options);
  }

  public read(request: Request): string | undefined {
    return request.cookies[this.name];
  }

  public clear(response: Response): void {
    response.clearCookie(this.name, { ...this.options, maxAge: undefined });
  }
}
