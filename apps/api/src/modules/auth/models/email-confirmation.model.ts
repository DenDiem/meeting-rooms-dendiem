export interface EmailConfirmationModel {
  readonly id: string;
  readonly userId: string;
  readonly expiresAt: Date;
}
