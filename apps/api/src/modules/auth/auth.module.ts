import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  DEFAULT_SESSION_COOKIE_NAME,
  DEFAULT_SESSION_TTL_DAYS,
  DEFAULT_WEB_BASE_URL,
} from '@config/config.constants';
import { readNumber } from '@config/read-number';
import { PrismaModule } from '@database/prisma.module';

import { AuthController } from './controllers/auth.controller';
import { ConfirmedEmailGuard } from './guards/confirmed-email.guard';
import { SessionGuard } from './guards/session.guard';
import {
  EMAIL_CONFIRMATION_CONFIG,
  type EmailConfirmationConfig,
} from './interfaces/email-confirmation-config.interface';
import { EMAIL_CONFIRMATION_REPOSITORY } from './interfaces/email-confirmation-repository.interface';
import { SESSION_CONFIG, type SessionConfig } from './interfaces/session-config.interface';
import { SESSION_REPOSITORY } from './interfaces/session-repository.interface';
import { USER_REPOSITORY } from './interfaces/user-repository.interface';
import { PrismaEmailConfirmationRepository } from './repositories/prisma-email-confirmation.repository';
import { PrismaSessionRepository } from './repositories/prisma-session.repository';
import { PrismaUserRepository } from './repositories/prisma-user.repository';
import { AuthService } from './services/auth.service';
import { EmailConfirmationService } from './services/email-confirmation.service';
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

const emailConfirmationConfigProvider = {
  provide: EMAIL_CONFIRMATION_CONFIG,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): EmailConfirmationConfig => ({
    webBaseUrl: configService.get<string>('WEB_BASE_URL') ?? DEFAULT_WEB_BASE_URL,
  }),
};

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [
    sessionConfigProvider,
    emailConfirmationConfigProvider,
    AuthService,
    EmailConfirmationService,
    SessionCookieService,
    SessionService,
    SessionGuard,
    ConfirmedEmailGuard,
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
    { provide: SESSION_REPOSITORY, useClass: PrismaSessionRepository },
    { provide: EMAIL_CONFIRMATION_REPOSITORY, useClass: PrismaEmailConfirmationRepository },
  ],
  exports: [SessionGuard, ConfirmedEmailGuard, SessionService],
})
export class AuthModule {}
