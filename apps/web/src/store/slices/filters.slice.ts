import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface FiltersState {
  minCapacity: number | null;
}

const initialState: FiltersState = { minCapacity: null };

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setMinCapacity: (state, action: PayloadAction<number | null>) => {
      state.minCapacity = action.payload;
    },
  },
  selectors: {
    selectMinCapacity: (state) => state.minCapacity,
  },
});

export const { setMinCapacity } = filtersSlice.actions;
export const { selectMinCapacity } = filtersSlice.selectors;
