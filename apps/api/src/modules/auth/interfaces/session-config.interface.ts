export const SESSION_CONFIG = Symbol('SessionConfig');

export interface SessionConfig {
  readonly ttlDays: number;
  readonly cookieName: string;
  readonly cookieSecure: boolean;
}
