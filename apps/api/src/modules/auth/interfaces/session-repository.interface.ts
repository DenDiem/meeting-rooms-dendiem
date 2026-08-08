import type { NewSessionDto } from '../dto/new-session.dto';
import type { SessionModel, SessionWithUserModel } from '../models/session.model';

export const SESSION_REPOSITORY = Symbol('SessionRepository');

export interface SessionRepository {
  create(session: NewSessionDto): Promise<SessionModel>;
  findActiveByTokenHash(tokenHash: string, now: Date): Promise<SessionWithUserModel | null>;
  revokeByTokenHash(tokenHash: string, revokedAt: Date): Promise<void>;
}
