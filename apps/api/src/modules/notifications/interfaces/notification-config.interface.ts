export const NOTIFICATION_CONFIG = Symbol('NotificationConfig');

export interface NotificationConfig {
  readonly notifyBeforeMinutes: number;
}
