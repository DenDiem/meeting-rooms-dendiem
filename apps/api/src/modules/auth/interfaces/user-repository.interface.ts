import type { NewUserDto } from '../dto/new-user.dto';
import type { UserModel } from '../models/user.model';

export const USER_REPOSITORY = Symbol('UserRepository');

export interface UserRepository {
  create(user: NewUserDto): Promise<UserModel>;
  findByNormalizedEmail(emailNormalized: UserModel['emailNormalized']): Promise<UserModel | null>;
}
