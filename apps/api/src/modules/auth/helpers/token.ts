import { createHash, randomBytes } from 'node:crypto';

import { TOKEN_BYTES } from '../constants/auth.constants';

export const createToken = (): string => randomBytes(TOKEN_BYTES).toString('base64url');

export const hashToken = (token: string): string =>
  createHash('sha256').update(token).digest('hex');
