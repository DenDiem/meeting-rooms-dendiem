import type { Session, User } from '@generated/prisma/client';

import type { SessionModel, SessionWithUserModel } from '../models/session.model';
import { toUserModel } from './user.factory';

type SessionRow = Session & { user: User };

export const toSessionModel = ({ id, userId, expiresAt }: Session): SessionModel => ({
  id,
  userId,
  expiresAt,
});

export const toSessionWithUserModel = (session: SessionRow): SessionWithUserModel => ({
  ...toSessionModel(session),
  user: toUserModel(session.user),
});
