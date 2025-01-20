import { apiRequest } from "../../api/apiRequest"; 
import { AxiosMethods } from "../../api/apiRequest";
import { createAsyncThunk } from "@reduxjs/toolkit";

// GET: Retrieve a list of all users
export const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await apiRequest<any[]>(AxiosMethods.GET, "/api/users");
      return data; // the API returns an array of users
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

// GET: Retrieve user details by ID
export const fetchUserById = createAsyncThunk(
  "users/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const data = await apiRequest<any>(AxiosMethods.GET, `/api/users/${id}`);
      return data; // the API returns a single user object
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

// POST: Add a new user
export const addUser = createAsyncThunk(
  "users/add",
  async (
    {
      username,
      fullName,
      email,
      password,
    }: { username: string; fullName: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await apiRequest<any>(AxiosMethods.POST, "/api/users", {
        username,
        password,
        fullName,
        email,
      });
      return data; // the API returns the created user
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add user"
      );
    }
  }
);

// PUT: Update an existing user
export const updateUser = createAsyncThunk(
  "users/update",
  async (
    {
      id,
      username,
      fullName,
      email,
      password,
    }: {
      id: string;
      username: string;
      fullName: string;
      email: string;
      password: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const data = await apiRequest<any>(AxiosMethods.PUT, `/api/users/${id}`, {
        username,
        password,
        fullName,
        email,
      });
      return data; //  the API returns the updated user
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user"
      );
    }
  }
);


export const deleteUser = createAsyncThunk(
  "users/delete",
  async (ids: string | string[], { rejectWithValue }) => {
    const idList = Array.isArray(ids) ? ids : [ids];
    const successfulDeletions: string[] = [];
    const errors: Record<string, string> = {};

    for (const id of idList) {
      try {
        await apiRequest(AxiosMethods.DELETE, `/api/users/${id}`);
        successfulDeletions.push(id);
      } catch (error: any) {
        errors[id] =
          error.response?.data?.message || `Failed to delete user with ID: ${id}`;
      }
    }

    if (Object.keys(errors).length > 0) {
      return rejectWithValue({
        message: "Some deletions failed.",
        errors,
      });
    }

    return successfulDeletions; 
  }
);

