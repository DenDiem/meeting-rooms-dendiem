import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';

import { ZodValidationPipe } from '@common/pipes/zod-validation.pipe';

import { CurrentUser } from '../decorators/current-user.decorator';
import type { ConfirmEmailDto } from '../dto/confirm-email.dto';
import type { LoginDto } from '../dto/login.dto';
import type { RegisterDto } from '../dto/register.dto';
import { SessionGuard } from '../guards/session.guard';
import { confirmEmailRequestSchema } from '../requests/confirm-email.request';
import { loginRequestSchema } from '../requests/login.request';
import { registerRequestSchema } from '../requests/register.request';
import type { PublicUserResource } from '../resources/public-user.resource';
import { AuthService } from '../services/auth.service';
import { EmailConfirmationService } from '../services/email-confirmation.service';
import { SessionCookieService } from '../services/session-cookie.service';
import { SessionService } from '../services/session.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly emailConfirmationService: EmailConfirmationService,
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

  @Post('confirm-email')
  @HttpCode(HttpStatus.OK)
  public confirmEmail(
    @Body(new ZodValidationPipe(confirmEmailRequestSchema)) { token }: ConfirmEmailDto,
  ): Promise<PublicUserResource> {
    return this.emailConfirmationService.confirm(token);
  }

  @Post('confirm-email/resend')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(SessionGuard)
  public resendConfirmation(@CurrentUser() user: PublicUserResource): Promise<void> {
    return this.emailConfirmationService.reissue(user);
  }

  @Get('me')
  @UseGuards(SessionGuard)
  public me(@CurrentUser() user: PublicUserResource): PublicUserResource {
    return user;
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.sessionService.end(request);

    this.sessionCookieService.clear(response);
  }
}
