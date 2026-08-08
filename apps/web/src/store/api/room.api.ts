import type { Room } from '@domain/models/interfaces/room.interface';

import { baseApi } from './base.api';

export const roomApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRooms: builder.query<Room[], number | null>({
      query: (minCapacity) => ({
        url: '/rooms',
        params: minCapacity === null ? undefined : { minCapacity },
      }),
      providesTags: ['Room'],
    }),
  }),
});

export const { useGetRoomsQuery } = roomApi;
