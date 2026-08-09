import type { UserModel } from '../models/user.model';

export interface PublicUserResource {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly isEmailConfirmed: boolean;
}

export const toPublicUserResource = ({
  id,
  name,
  email,
  emailConfirmedAt,
}: UserModel): PublicUserResource => ({
  id,
  name,
  email,
  isEmailConfirmed: emailConfirmedAt !== null,
});
