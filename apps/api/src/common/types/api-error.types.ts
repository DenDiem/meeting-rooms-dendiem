export interface ApiErrorBody {
  readonly message: string;
  readonly fields?: Record<string, string>;
}
