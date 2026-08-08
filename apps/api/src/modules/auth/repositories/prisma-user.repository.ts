import { Injectable } from '@nestjs/common';

import { UNIQUE_VIOLATION_CODE } from '@database/prisma-error.constants';
import { PrismaService } from '@database/prisma.service';
import { Prisma } from '@generated/prisma/client';

import type { NewUserDto } from '../dto/new-user.dto';
import { EmailAlreadyTakenException } from '../exceptions/email-already-taken.exception';
import { toUserModel } from '../factories/user.factory';
import type { UserRepository } from '../interfaces/user-repository.interface';
import type { UserModel } from '../models/user.model';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  public async create(user: NewUserDto): Promise<UserModel> {
    try {
      return toUserModel(await this.prismaService.user.create({ data: user }));
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === UNIQUE_VIOLATION_CODE
      ) {
        throw new EmailAlreadyTakenException();
      }

      throw error;
    }
  }

  public async findByNormalizedEmail(
    emailNormalized: UserModel['emailNormalized'],
  ): Promise<UserModel | null> {
    const user = await this.prismaService.user.findUnique({ where: { emailNormalized } });

    return user ? toUserModel(user) : null;
  }
}
