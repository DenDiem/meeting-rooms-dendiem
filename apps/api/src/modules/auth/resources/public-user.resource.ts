import type { UserModel } from '../models/user.model';

export interface PublicUserResource {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

export const toPublicUserResource = ({ id, name, email }: UserModel): PublicUserResource => ({
  id,
  name,
  email,
});
