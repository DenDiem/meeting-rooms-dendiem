import type { Request } from 'express';

import type { PublicUserResource } from '../resources/public-user.resource';

export interface AuthenticatedRequest extends Request {
  user?: PublicUserResource;
}
