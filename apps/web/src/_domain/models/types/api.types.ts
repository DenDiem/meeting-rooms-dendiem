export interface ApiErrorBody {
  readonly message?: string | string[];
  readonly fields?: Record<string, string>;
}
