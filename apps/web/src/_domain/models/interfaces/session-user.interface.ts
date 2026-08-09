export interface SessionUser {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly isEmailConfirmed: boolean;
}
