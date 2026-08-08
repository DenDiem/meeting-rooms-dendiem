import { Injectable } from '@nestjs/common';

import { PrismaService } from '@database/prisma.service';

import type { NewSessionDto } from '../dto/new-session.dto';
import { toSessionModel, toSessionWithUserModel } from '../factories/session.factory';
import type { SessionRepository } from '../interfaces/session-repository.interface';
import type { SessionModel, SessionWithUserModel } from '../models/session.model';

@Injectable()
export class PrismaSessionRepository implements SessionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(session: NewSessionDto): Promise<SessionModel> {
    return toSessionModel(await this.prismaService.session.create({ data: session }));
  }

  public async findActiveByTokenHash(
    tokenHash: string,
    now: Date,
  ): Promise<SessionWithUserModel | null> {
    const session = await this.prismaService.session.findFirst({
      where: { tokenHash, revokedAt: null, expiresAt: { gt: now } },
      include: { user: true },
    });

    return session ? toSessionWithUserModel(session) : null;
  }

  public async revokeByTokenHash(tokenHash: string, revokedAt: Date): Promise<void> {
    await this.prismaService.session.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt },
    });
  }
}
