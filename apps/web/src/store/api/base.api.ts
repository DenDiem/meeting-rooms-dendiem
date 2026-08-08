import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { API_PREFIX } from '@domain/models/constants/api.constants';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: API_PREFIX, credentials: 'same-origin' }),
  tagTypes: ['Session', 'Room', 'Schedule', 'MyBookings'],
  endpoints: () => ({}),
});
