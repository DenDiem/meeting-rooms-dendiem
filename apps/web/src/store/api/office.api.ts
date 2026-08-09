import type { OfficeHours } from '@domain/models/interfaces/office.interface';

import { baseApi } from './base.api';

export const officeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOffice: builder.query<OfficeHours, void>({
      query: () => '/office',
      providesTags: ['Office'],
    }),
  }),
});

export const { useGetOfficeQuery } = officeApi;
