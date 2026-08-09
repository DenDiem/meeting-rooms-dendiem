import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { DEFAULT_SESSION_COOKIE_NAME, DEFAULT_SESSION_TTL_DAYS } from '@config/config.constants';
import { readNumber } from '@config/read-number';
import { PrismaModule } from '@database/prisma.module';

import { AuthController } from './controllers/auth.controller';
import { SessionGuard } from './guards/session.guard';
import { SESSION_CONFIG, type SessionConfig } from './interfaces/session-config.interface';
import { SESSION_REPOSITORY } from './interfaces/session-repository.interface';
import { USER_REPOSITORY } from './interfaces/user-repository.interface';
import { PrismaSessionRepository } from './repositories/prisma-session.repository';
import { PrismaUserRepository } from './repositories/prisma-user.repository';
import { AuthService } from './services/auth.service';
import { SessionCookieService } from './services/session-cookie.service';
import { SessionService } from './services/session.service';

const sessionConfigProvider = {
  provide: SESSION_CONFIG,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): SessionConfig => ({
    ttlDays: readNumber(configService.get('SESSION_TTL_DAYS'), DEFAULT_SESSION_TTL_DAYS),
    cookieName: configService.get<string>('SESSION_COOKIE_NAME') ?? DEFAULT_SESSION_COOKIE_NAME,
    cookieSecure: configService.get('SESSION_COOKIE_SECURE') === 'true',
  }),
};

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [
    sessionConfigProvider,
    AuthService,
    SessionCookieService,
    SessionService,
    SessionGuard,
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
    { provide: SESSION_REPOSITORY, useClass: PrismaSessionRepository },
  ],
  exports: [SessionGuard, SessionService],
})
export class AuthModule {}
