// features/auth/changePasswordSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosInstance';

const API_URL = import.meta.env.VITE_PORT_URL;


// Async thunk to call change password API
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/change-password-agency`, passwordData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

const changePasswordSlice = createSlice({
  name: 'changePassword',
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetChangePasswordState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Password change failed';
      });
  }
});

export const { resetChangePasswordState } = changePasswordSlice.actions;
export default changePasswordSlice.reducer;
