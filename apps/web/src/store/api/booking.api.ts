import type {
  Booking,
  CreateBookingPayload,
  MyBookingsQuery,
  PaginatedBookings,
  WeekScheduleQuery,
} from '@domain/models/interfaces/booking.interface';

import { baseApi } from './base.api';

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
