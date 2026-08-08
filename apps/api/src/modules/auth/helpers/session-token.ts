import { createHash, randomBytes } from 'node:crypto';

import { SESSION_TOKEN_BYTES } from '../constants/auth.constants';

export const createSessionToken = (): string =>
  randomBytes(SESSION_TOKEN_BYTES).toString('base64url');

export const hashSessionToken = (token: string): string =>
  createHash('sha256').update(token).digest('hex');
