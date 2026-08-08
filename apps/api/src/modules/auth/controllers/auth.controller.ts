import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import type { Response } from 'express';

import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';

import type { LoginDto } from '../dto/login.dto';
import type { RegisterDto } from '../dto/register.dto';
import { loginRequestSchema } from '../requests/login.request';
import { registerRequestSchema } from '../requests/register.request';
import type { PublicUserResource } from '../resources/public-user.resource';
import { AuthService } from '../services/auth.service';
import { SessionCookieService } from '../services/session-cookie.service';
import { SessionService } from '../services/session.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
    private readonly sessionCookieService: SessionCookieService,
  ) {}

  @Post('register')
  public async register(
    @Body(new ZodValidationPipe(registerRequestSchema)) dto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<PublicUserResource> {
    const user = await this.authService.register(dto);

    this.sessionCookieService.set(response, await this.sessionService.start(user.id));

    return user;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(
    @Body(new ZodValidationPipe(loginRequestSchema)) dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<PublicUserResource> {
    const user = await this.authService.login(dto);

    this.sessionCookieService.set(response, await this.sessionService.start(user.id));

    return user;
  }
}
