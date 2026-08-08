import type { UserModel } from './user.model';

export interface SessionModel {
  readonly id: string;
  readonly userId: string;
  readonly expiresAt: Date;
}

export interface SessionWithUserModel extends SessionModel {
  readonly user: UserModel;
}
