import { Module } from '@nestjs/common';

import { PrismaModule } from '@database/prisma.module';

import { AuthController } from './controllers/auth.controller';
import { SESSION_REPOSITORY } from './interfaces/session-repository.interface';
import { USER_REPOSITORY } from './interfaces/user-repository.interface';
import { PrismaSessionRepository } from './repositories/prisma-session.repository';
import { PrismaUserRepository } from './repositories/prisma-user.repository';
import { AuthService } from './services/auth.service';
import { SessionCookieService } from './services/session-cookie.service';
import { SessionService } from './services/session.service';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    SessionCookieService,
    SessionService,
    { provide: USER_REPOSITORY, useClass: PrismaUserRepository },
    { provide: SESSION_REPOSITORY, useClass: PrismaSessionRepository },
  ],
  exports: [SessionService],
})
export class AuthModule {}
