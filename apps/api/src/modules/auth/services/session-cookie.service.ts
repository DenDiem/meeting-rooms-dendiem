import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { CookieOptions, Request, Response } from 'express';

import { MILLISECONDS_PER_DAY } from '@common/constants/time.constants';
import { DEFAULT_SESSION_COOKIE_NAME, DEFAULT_SESSION_TTL_DAYS } from '@config/config.constants';

@Injectable()
export class SessionCookieService {
  private readonly name: string;
  private readonly options: CookieOptions;

  constructor(configService: ConfigService) {
    const ttlDays = Number(configService.get('SESSION_TTL_DAYS') ?? DEFAULT_SESSION_TTL_DAYS);

    this.name = configService.get<string>('SESSION_COOKIE_NAME') ?? DEFAULT_SESSION_COOKIE_NAME;
    this.options = {
      httpOnly: true,
      sameSite: 'lax',
      secure: configService.get('SESSION_COOKIE_SECURE') === 'true',
      path: '/',
      maxAge: ttlDays * MILLISECONDS_PER_DAY,
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
