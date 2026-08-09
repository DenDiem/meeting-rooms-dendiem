import type { EndingNotification } from '@domain/models/interfaces/notification.interface';

import { baseApi } from './base.api';

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<EndingNotification[], void>({
      query: () => '/notifications',
      providesTags: ['Notification'],
    }),

    markNotificationRead: builder.mutation<void, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: 'POST',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const { useGetNotificationsQuery, useMarkNotificationReadMutation } = notificationApi;
