export interface HealthResource {
  readonly status: 'ok';
  readonly database: 'up' | 'down';
}
