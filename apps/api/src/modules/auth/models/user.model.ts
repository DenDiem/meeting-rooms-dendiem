export interface UserModel {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly emailNormalized: string;
  readonly passwordHash: string;
}
