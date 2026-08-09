import { Injectable } from '@nestjs/common';

import { PrismaService } from '@database/prisma.service';

import type { NewEmailConfirmationDto } from '../dto/new-email-confirmation.dto';
import { toEmailConfirmationModel } from '../factories/email-confirmation.factory';
import { toUserModel } from '../factories/user.factory';
import type { EmailConfirmationRepository } from '../interfaces/email-confirmation-repository.interface';
import type { EmailConfirmationModel } from '../models/email-confirmation.model';
import type { UserModel } from '../models/user.model';

@Injectable()
export class PrismaEmailConfirmationRepository implements EmailConfirmationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(confirmation: NewEmailConfirmationDto): Promise<EmailConfirmationModel> {
    return toEmailConfirmationModel(
      await this.prismaService.emailConfirmation.create({ data: confirmation }),
    );
  }

  public async findPendingByTokenHash(
    tokenHash: string,
    now: Date,
  ): Promise<EmailConfirmationModel | null> {
    const confirmation = await this.prismaService.emailConfirmation.findFirst({
      where: { tokenHash, usedAt: null, expiresAt: { gt: now } },
    });

    return confirmation ? toEmailConfirmationModel(confirmation) : null;
  }

  public async confirm(
    confirmationId: EmailConfirmationModel['id'],
    userId: UserModel['id'],
    confirmedAt: Date,
  ): Promise<UserModel> {
    const [, user] = await this.prismaService.$transaction([
      this.prismaService.emailConfirmation.update({
        where: { id: confirmationId },
        data: { usedAt: confirmedAt },
      }),
      this.prismaService.user.update({
        where: { id: userId },
        data: { emailConfirmedAt: confirmedAt },
      }),
    ]);

    return toUserModel(user);
  }
}
