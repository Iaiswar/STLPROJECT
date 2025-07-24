import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../../store/store";
import { clearTokens, setTokens, refreshToken, accessToken } from "../AuthSlice/StoreToken";

interface UserData {
  email: string;
  first_name: string;
  last_name: string;
  employeeid: string;
  role: string;
  hq: string;
  factory: string;
  department: string;
  status: boolean;
}

interface FormData {
  email: string;
  password: string;
}

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  user: UserData | null;
}

// Define return types for async thunks
interface LoginResponse {
  user: UserData;
  message?: string;
}

interface LogoutResponse {
  message: string;
  success: boolean;
}

interface ErrorResponse {
  message: string;
}

const initialState: AuthState = {
  token: null,
  loading: false,
  error: null,
  message: null,
  user: null,
};

export const loginData = createAsyncThunk<
  LoginResponse,
  FormData,
  { rejectValue: ErrorResponse }
>(
  "auth/loginData",
  async (formData: FormData, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post<{
        user: UserData;
        access_token: string;
        refresh_token: string;
        message?: string;
      }>("http://127.0.0.1:8000/login/", formData);
      
      if (!response || !response.data) {
        throw new Error("Invalid response from server");
      }
      
      dispatch(setTokens({
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token
      }));
      
      return {
        user: response.data.user,
        message: response.data.message
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         error.message || 
                         "Login failed";
      return rejectWithValue({ message: errorMessage });
    }
  }
);

export const logout = createAsyncThunk<
  LogoutResponse,
  { navigate: (path: string) => void },
  { state: RootState, rejectValue: ErrorResponse }
>(
  "auth/logout",
  async ({ navigate }, { dispatch, getState, rejectWithValue }) => {
    try {
      const refreshTokenValue = refreshToken(getState());
      const accessTokenValue = accessToken(getState());
      
      if (!refreshTokenValue) {
        dispatch(clearTokens());
        dispatch(clearLoginData());
        navigate('/');
        return { message: "Logged out successfully", success: true };
      }

      const response = await axios.post(
        "http://127.0.0.1:8000/logout/",
        { refresh_token: refreshTokenValue },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessTokenValue}`,
          }
        }
      );

      if (response.status === 200) {
        dispatch(clearTokens());
        dispatch(clearLoginData());
        navigate('/');
        return { 
          message: response.data?.message || "Logged out successfully", 
          success: true 
        };
      }
      throw new Error("Unexpected response from server");
    } catch (error: any) {
      const errorMessage = error.response?.data?.error ||
                         error.response?.data?.message ||
                         error.message ||
                         "Logout failed";
      return rejectWithValue({ message: errorMessage });
    }
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    clearLoginData: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      state.message = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginData.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(loginData.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = null;
        state.error = null;
        state.message = action.payload.message || "Login successful";
      })
      .addCase(loginData.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.error = action.payload?.message || "Authentication failed";
        state.message = null;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(logout.fulfilled, (state, action: PayloadAction<LogoutResponse>) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(logout.rejected, (state, action: PayloadAction<ErrorResponse | undefined>) => {
        state.loading = false;
        state.error = action.payload?.message || "Logout failed";
        state.message = null;
      });
  },
});

// Selectors
export const currentRole = (state: RootState) => state.LoginData.user?.role;
export const selectMessage = (state: RootState) => state.LoginData.message;
export const selectError = (state: RootState) => state.LoginData.error;
export const selectLoading = (state: RootState) => state.LoginData.loading;
export const selectUser = (state: RootState) => state.LoginData.user;

export const { clearLoginData, clearMessage, clearError, setMessage } = loginSlice.actions;
export default loginSlice.reducer;