import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import userReducer from './slices/usersSlice'; 
import { setTokenGetter } from '../api/apiRequest';
// Configure the store
export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,  
    users: userReducer,  
  },
});

setTokenGetter(() => store.getState().auth.token);
// Infer the `RootState` type from the store's state
export type RootState = ReturnType<typeof store.getState>;

// Infer the `AppDispatch` type from the store's dispatch function
export type AppDispatch = typeof store.dispatch;
