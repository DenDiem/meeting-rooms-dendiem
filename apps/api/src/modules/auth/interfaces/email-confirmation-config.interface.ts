export const EMAIL_CONFIRMATION_CONFIG = Symbol('EmailConfirmationConfig');

export interface EmailConfirmationConfig {
  readonly webBaseUrl: string;
}
