import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcryptjs';

import { INVALID_CREDENTIALS_MESSAGE, PASSWORD_SALT_ROUNDS } from '../constants/auth.constants';
import type { LoginDto } from '../dto/login.dto';
import type { RegisterDto } from '../dto/register.dto';
import { EmailAlreadyTakenException } from '../exceptions/email-already-taken.exception';
import { normalizeEmail } from '../helpers/normalize-email';
import { USER_REPOSITORY, type UserRepository } from '../interfaces/user-repository.interface';
import { toPublicUserResource, type PublicUserResource } from '../resources/public-user.resource';

@Injectable()
export class AuthService {
  constructor(@Inject(USER_REPOSITORY) private readonly userRepository: UserRepository) {}

  public async register({ name, email, password }: RegisterDto): Promise<PublicUserResource> {
    try {
      const user = await this.userRepository.create({
        name,
        email,
        emailNormalized: normalizeEmail(email),
        passwordHash: await hash(password, PASSWORD_SALT_ROUNDS),
      });

      return toPublicUserResource(user);
    } catch (error) {
      if (error instanceof EmailAlreadyTakenException) {
        throw new ConflictException(error.message);
      }

      throw error;
    }
  }

  public async login({ email, password }: LoginDto): Promise<PublicUserResource> {
    const user = await this.userRepository.findByNormalizedEmail(normalizeEmail(email));

    if (!user || !(await compare(password, user.passwordHash))) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    return toPublicUserResource(user);
  }
}
