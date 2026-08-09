import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';

import { MILLISECONDS_PER_HOUR } from '@common/constants/time.constants';

import {
  EMAIL_ALREADY_CONFIRMED_MESSAGE,
  EMAIL_CONFIRMATION_TTL_HOURS,
  INVALID_CONFIRMATION_MESSAGE,
} from '../constants/auth.constants';
import { createToken, hashToken } from '../helpers/token';
import {
  EMAIL_CONFIRMATION_CONFIG,
  type EmailConfirmationConfig,
} from '../interfaces/email-confirmation-config.interface';
import {
  EMAIL_CONFIRMATION_REPOSITORY,
  type EmailConfirmationRepository,
} from '../interfaces/email-confirmation-repository.interface';
import { toPublicUserResource, type PublicUserResource } from '../resources/public-user.resource';

@Injectable()
export class EmailConfirmationService {
  private readonly logger = new Logger(EmailConfirmationService.name);

  constructor(
    @Inject(EMAIL_CONFIRMATION_REPOSITORY)
    private readonly emailConfirmationRepository: EmailConfirmationRepository,
    @Inject(EMAIL_CONFIRMATION_CONFIG)
    private readonly emailConfirmationConfig: EmailConfirmationConfig,
  ) {}

  public async issue(user: PublicUserResource): Promise<void> {
    const token = createToken();

    await this.emailConfirmationRepository.create({
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + EMAIL_CONFIRMATION_TTL_HOURS * MILLISECONDS_PER_HOUR),
    });

    this.logger.log(
      `Confirmation link for ${user.email}: ${this.emailConfirmationConfig.webBaseUrl}/confirm-email?token=${token}`,
    );
  }

  public reissue(user: PublicUserResource): Promise<void> {
    if (user.isEmailConfirmed) {
      throw new BadRequestException(EMAIL_ALREADY_CONFIRMED_MESSAGE);
    }

    return this.issue(user);
  }

  public async confirm(token: string): Promise<PublicUserResource> {
    const confirmation = await this.emailConfirmationRepository.findPendingByTokenHash(
      hashToken(token),
      new Date(),
    );

    if (!confirmation) {
      throw new BadRequestException(INVALID_CONFIRMATION_MESSAGE);
    }

    return toPublicUserResource(
      await this.emailConfirmationRepository.confirm(
        confirmation.id,
        confirmation.userId,
        new Date(),
      ),
    );
  }
}
