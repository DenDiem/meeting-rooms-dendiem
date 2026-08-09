import { UNAUTHORIZED_STATUS } from '@domain/models/constants/api.constants';
import type {
  LoginPayload,
  RegisterPayload,
} from '@domain/models/interfaces/auth-payload.interface';
import type { SessionUser } from '@domain/models/interfaces/session-user.interface';

import { baseApi } from './base.api';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSession: builder.query<SessionUser | null, void>({
      queryFn: async (_argument, _api, _options, baseQuery) => {
        const result = await baseQuery('/auth/me');

        if (result.error) {
          return result.error.status === UNAUTHORIZED_STATUS
            ? { data: null }
            : { error: result.error };
        }

        return { data: result.data as SessionUser };
      },
      providesTags: ['Session'],
    }),

    login: builder.mutation<SessionUser, LoginPayload>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      invalidatesTags: ['Session', 'Room', 'Schedule', 'MyBookings'],
    }),

    register: builder.mutation<SessionUser, RegisterPayload>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
      invalidatesTags: ['Session', 'Room', 'Schedule', 'MyBookings'],
    }),

    confirmEmail: builder.mutation<SessionUser, string>({
      query: (token) => ({ url: '/auth/confirm-email', method: 'POST', body: { token } }),
      invalidatesTags: ['Session'],
    }),

    resendConfirmation: builder.mutation<void, void>({
      query: () => ({ url: '/auth/confirm-email/resend', method: 'POST' }),
    }),

    logout: builder.mutation<void, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      invalidatesTags: ['Session', 'Room', 'Schedule', 'MyBookings'],
    }),
  }),
});

export const {
  useGetSessionQuery,
  useLoginMutation,
  useRegisterMutation,
  useConfirmEmailMutation,
  useResendConfirmationMutation,
  useLogoutMutation,
} = authApi;
