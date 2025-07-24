// src/features/auth/authSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
};

const storeToken = createSlice({
  name: 'storeToken',
  initialState,
  reducers: {
    setTokens: (
      state,
      action: PayloadAction<{
        access_token: string;
        refresh_token: string;
      }>
    ) => {
      state.accessToken = action.payload.access_token;
      state.refreshToken = action.payload.refresh_token;
    },
    clearTokens: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { setTokens, clearTokens } = storeToken.actions;

export const accessToken = (state: RootState) => state.StoreTokenData.accessToken;
export const refreshToken = (state: RootState) => state.StoreTokenData.refreshToken;


export default storeToken.reducer;
// StoreTokenData
