import { configureStore } from '@reduxjs/toolkit';

import { baseApi } from './api/base.api';
import { filtersSlice } from './slices/filters.slice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [filtersSlice.reducerPath]: filtersSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
