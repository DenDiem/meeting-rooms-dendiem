import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query';

import { API_PREFIX } from '@domain/models/constants/api.constants';
import type { ApiEnvelope, PaginationMeta } from '@domain/models/types/api.types';

export type EnvelopeMeta = Partial<FetchBaseQueryMeta> & { readonly pagination?: PaginationMeta };

const isEnvelope = (value: unknown): value is ApiEnvelope =>
  typeof value === 'object' && value !== null && 'data' in value;

const httpQuery = fetchBaseQuery({ baseUrl: API_PREFIX, credentials: 'same-origin' });

const envelopeQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  object,
  EnvelopeMeta
> = async (args, api, extraOptions) => {
  const result = await httpQuery(args, api, extraOptions);

  if (result.error !== undefined || !isEnvelope(result.data)) {
    return result;
  }

  return { data: result.data.data, meta: { ...result.meta, pagination: result.data.meta } };
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: envelopeQuery,
  tagTypes: ['Session', 'Room', 'Schedule', 'MyBookings'],
  endpoints: () => ({}),
});
