export interface NewEmailConfirmationDto {
  readonly userId: string;
  readonly tokenHash: string;
  readonly expiresAt: Date;
}
