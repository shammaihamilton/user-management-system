import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {fetchUsers, fetchUserById , addUser, updateUser, deleteUser } from '../thunks/usersThunk';


// Define the initialState
    const initialState: { users: any[]; singleUser: any | null; loading: boolean; error: string | null } = {
      users: [],
      singleUser: null,
      loading: false,
      error: null,
    };


// User Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetchUsers
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle fetchUserById
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.singleUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle addUser
    builder
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.users.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle updateUser
    builder
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.users = state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        );
      })
      .addCase(updateUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle deleteUser
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.loading = false;
        state.users = state.users.filter((user) => !action.payload.includes(user._id));
      })
      .addCase(deleteUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload.message; // Display a general error message
        console.error("Failed deletions:", action.payload.errors); // Log detailed errors
      });
  },
});

export default userSlice.reducer;
