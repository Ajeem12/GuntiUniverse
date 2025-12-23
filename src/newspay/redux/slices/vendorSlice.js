// src/redux/slices/vendorSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const API_URL = import.meta.env.VITE_PORT_URL;

// POST: Vendor registration
export const registerVendor = createAsyncThunk(
  'vendor/registerVendor',
  async (vendorData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/news-agency-reg`, vendorData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const vendorSlice = createSlice({
  name: 'vendor',
  initialState: {
    loading: false,
    error: null,
    success: false,
    data: null,
  },
  reducers: {
    resetStatus: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerVendor.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
      })
      .addCase(registerVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetStatus } = vendorSlice.actions;
export default vendorSlice.reducer;
