import { createSlice,
    PayloadAction } from '@reduxjs/toolkit';
import { login, logout } from '../../redux/thunks/authThunk';

// Define the shape of the auth state
interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  // user: Record<string, any> | null; 
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  token: localStorage.getItem('jwtToken'),
  isAuthenticated: !!localStorage.getItem('jwtToken'),
  // user: null,
  loading: false,
  error: null,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; user: any }>) => {
        state.loading = false;
        state.token = action.payload.token;
        // state.user = action.payload.user;
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
        // state.user = null;
        localStorage.removeItem('jwtToken');
        state.isAuthenticated = false;
      });
  },
});

// export const { clearAuth } = authSlice.actions;

export default authSlice.reducer;
