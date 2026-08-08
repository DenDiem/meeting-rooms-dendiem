export interface NewUserDto {
  readonly name: string;
  readonly email: string;
  readonly emailNormalized: string;
  readonly passwordHash: string;
}
