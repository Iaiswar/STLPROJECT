import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState {
  user: {
    email: string;
    password: string;
    employeeid: string;
    role: string;
    first_name: string,
    plant: string,
    station: string,
    last_name: string,
  } | null;
  loading: boolean;
  error: any; // Changed type to any to handle structured error objects
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  "registerauth/registerUser",
  async (
    userData: { first_name: string, last_name: string, email: string; password: string; employeeid: string; role: string },
    { rejectWithValue }
  ) => {
    try {
      //console.log("Data being sent to backend:", userData);
      //console.log("Before API Request:", localStorage.getItem("access_token"));
      const response = await axios.post("http://127.0.0.1:8000/register/", userData);
      //console.log("Response from backend:", response.data);
      //console.log("After API Request:", localStorage.getItem("access_token"));
      return response.data;
    } catch (error: any) {
      console.error("Error from backend:", error.response?.data || error.message);
      // Return the structured error data from the backend
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const authSlice = createSlice({
  name: "registerUserauth",
  initialState,
  reducers: {
    // Add a clear error reducer to reset the error state
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        // Store the entire error object to handle structured errors
        state.error = action.payload || "Unknown error occurred";
      });
  },
});

// Export the clearError action
export const { clearError } = authSlice.actions;

// Add selector to get specific error messages
export const selectError = (state: { registerUserauth: AuthState }) => state.registerUserauth.error;

export default authSlice.reducer;