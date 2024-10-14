import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContractState } from './contracts.type';

const initialState: ContractState = {
  selectedContract: null,
  selectedExpiry: null,
};

const contractSlice = createSlice({
  name: 'contract',
  initialState,
  reducers: {
    setSelectedContract: (state, action: PayloadAction<string>) => {
      state.selectedContract = action.payload;
      state.selectedExpiry = null;
    },
    setSelectedExpiry: (state, action: PayloadAction<string>) => {
      state.selectedExpiry = action.payload;
    },
  },
});

export const { setSelectedContract, setSelectedExpiry } = contractSlice.actions;
export const contractReducer = contractSlice.reducer;
