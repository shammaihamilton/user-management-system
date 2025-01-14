import { AxiosMethods } from '../../api/apiRequest';
import {  createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '../../api/apiRequest';

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
  

  export const logout = createAsyncThunk('auth/logout', async () => {
    try {

      await apiRequest(AxiosMethods.POST, '/auth/logout');
  
    } catch (error: any) {
      console.error('Logout failed:', error.message);
    }
  });