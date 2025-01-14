import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiRequest } from '../../api/apiRequest'; // Path to your apiRequest function
import { AxiosMethods } from '../../api/apiRequest';
// Define the shape of the auth state
interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: Record<string, any> | null; // Adjust user type as needed
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  token: localStorage.getItem('jwtToken'),
  isAuthenticated: !!localStorage.getItem('jwtToken'),
  user: null,
  loading: false,
  error: null,
};

// Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async (
    { username, password }: { username: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await apiRequest<{ token: string; user: any }>(AxiosMethods.POST, 'api/auth/login', {
        username,
        password,
      });
      return data; // Assumes API response includes { token, user }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Async thunk for logout
export const logout = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  try {
    // Optionally, make a request to invalidate the token on the server
    await apiRequest(AxiosMethods.POST, '/auth/logout');

    // Clear token and user data (handled by slice reducers)
    dispatch(authSlice.actions.clearAuth());
  } catch (error: any) {
    console.error('Logout failed:', error.message);
  }
});

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('jwtToken'); // Clear token from storage
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; user: any }>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('jwtToken', action.payload.token);
        state.isAuthenticated = true;
        console.log(state.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        localStorage.removeItem('jwtToken');
        state.isAuthenticated = false;
      });
  },
});

export const { clearAuth } = authSlice.actions;

export default authSlice.reducer;
