import type {
  Booking,
  CreateBookingPayload,
  MyBookingsQuery,
  PaginatedBookings,
  WeekScheduleQuery,
} from '@domain/models/interfaces/booking.interface';

import { baseApi, type EnvelopeMeta } from './base.api';

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWeekSchedule: builder.query<Booking[], WeekScheduleQuery>({
      query: ({ roomId, week }) => ({ url: '/bookings/schedule', params: { roomId, week } }),
      providesTags: ['Schedule'],
    }),

    getMyBookings: builder.query<PaginatedBookings, MyBookingsQuery>({
      query: ({ scope, page, perPage }) => ({
        url: '/bookings/mine',
        params: { scope, page, perPage },
      }),
      transformResponse: (items: Booking[], meta?: EnvelopeMeta) => ({
        items,
        total: meta?.pagination?.total ?? items.length,
        page: meta?.pagination?.page ?? 1,
        perPage: meta?.pagination?.perPage ?? items.length,
      }),
      providesTags: ['MyBookings'],
    }),

    createBooking: builder.mutation<Booking, CreateBookingPayload>({
      query: (body) => ({ url: '/bookings', method: 'POST', body }),
      invalidatesTags: ['Schedule', 'MyBookings'],
    }),

    cancelBooking: builder.mutation<void, string>({
      query: (bookingId) => ({ url: `/bookings/${bookingId}`, method: 'DELETE' }),
      invalidatesTags: ['Schedule', 'MyBookings'],
    }),
  }),
});

export const {
  useGetWeekScheduleQuery,
  useGetMyBookingsQuery,
  useCreateBookingMutation,
  useCancelBookingMutation,
} = bookingApi;
