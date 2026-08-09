import type { User } from '@generated/prisma/client';
import type { UserModel } from '../models/user.model';

export const toUserModel = ({
  id,
  name,
  email,
  emailNormalized,
  passwordHash,
  emailConfirmedAt,
}: User): UserModel => ({
  id,
  name,
  email,
  emailNormalized,
  passwordHash,
  emailConfirmedAt,
});
