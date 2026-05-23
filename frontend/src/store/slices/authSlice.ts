import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User, AuthState } from "../types/auth";

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("authToken"),
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const verifyToken = createAsyncThunk(
  "auth/verify",
  async (authToken: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/verify` ||
          "http://localhost:5000/api/auth/verify",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        return data.data?.user || null;
      } else {
        return rejectWithValue("Token verification failed");
      }
    } catch (error) {
      return rejectWithValue("Network error during token verification");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem("authToken", action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("authToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        verifyToken.fulfilled,
        (state, action: PayloadAction<User | null>) => {
          state.isLoading = false;
          state.user = action.payload;
          state.isAuthenticated = !!action.payload;
        },
      )
      .addCase(verifyToken.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
        localStorage.removeItem("authToken");
      });
  },
});

export const { setAuth, logout } = authSlice.actions;
export const selectToken = (state: { auth: AuthState }) =>
  state.auth.token || localStorage.getItem("authToken");
export default authSlice.reducer;
