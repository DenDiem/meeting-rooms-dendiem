import type { EmailConfirmation } from '@generated/prisma/client';

import type { EmailConfirmationModel } from '../models/email-confirmation.model';

export const toEmailConfirmationModel = ({
  id,
  userId,
  expiresAt,
}: EmailConfirmation): EmailConfirmationModel => ({ id, userId, expiresAt });
