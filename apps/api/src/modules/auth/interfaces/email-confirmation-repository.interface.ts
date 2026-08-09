import type { NewEmailConfirmationDto } from '../dto/new-email-confirmation.dto';
import type { EmailConfirmationModel } from '../models/email-confirmation.model';
import type { UserModel } from '../models/user.model';

export const EMAIL_CONFIRMATION_REPOSITORY = Symbol('EmailConfirmationRepository');

export interface EmailConfirmationRepository {
  create(confirmation: NewEmailConfirmationDto): Promise<EmailConfirmationModel>;
  findPendingByTokenHash(tokenHash: string, now: Date): Promise<EmailConfirmationModel | null>;
  confirm(
    confirmationId: EmailConfirmationModel['id'],
    userId: UserModel['id'],
    confirmedAt: Date,
  ): Promise<UserModel>;
}
