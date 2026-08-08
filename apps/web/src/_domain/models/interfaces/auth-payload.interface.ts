export interface LoginPayload {
  readonly email: string;
  readonly password: string;
}

export interface RegisterPayload {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}
