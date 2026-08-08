export interface NewSessionDto {
  readonly userId: string;
  readonly tokenHash: string;
  readonly expiresAt: Date;
}
