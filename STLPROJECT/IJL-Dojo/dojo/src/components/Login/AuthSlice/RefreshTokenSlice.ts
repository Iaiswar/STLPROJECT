import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../../app/store";
import { setTokens } from "./StoreToken";

interface Token {
  refresh_token: string;
  access_token: string;
}

interface AuthState {
  token: Token | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  loading: false,
  error: null,
};

// Async thunk to refresh token
export const refreshTokenReq = createAsyncThunk(
  "auth/refreshTokenReq",
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;

      // Extract tokens from Redux state
      const tokenData = state.StoreTokenData.refreshToken; // Ensure correct access to tokens
      //console.log("Stored Token Data:", tokenData);

      if (!tokenData) {
        throw new Error("No refresh token available");
      }

      // API request to refresh the token
      const response = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
        refresh: tokenData,
      });

      if (response.status !== 200) {
        throw new Error("Failed to refresh token");
      }

      //console.log("Refreshed Token Response:", response.data);

      // Extract new access token from the response
      const { access_token, refresh_token } = response.data;

      // Dispatch setTokens to update Redux state with the new tokens
      dispatch(
        setTokens({
          access_token,
          refresh_token: refresh_token || tokenData, // Use new refresh token if provided, else keep the old one
        })
      );

      return { access_token, refresh_token: refresh_token || tokenData };
    } catch (error: any) {
      console.error("Error during token refresh:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice to manage authentication state
const refreshToken = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(refreshTokenReq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshTokenReq.fulfilled, (state, action: PayloadAction<Token>) => {
        state.loading = false;
        state.token = action.payload;
        state.error = null;
      })
      .addCase(refreshTokenReq.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.token = null; // Remove only the access token
        state.error = action.payload;
      });
  },
});

export default refreshToken.reducer;
