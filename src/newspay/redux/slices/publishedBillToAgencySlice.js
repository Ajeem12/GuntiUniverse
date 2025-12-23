// src/redux/slices/publishedBillToAgencySlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance";

const API_URL = import.meta.env.VITE_PORT_URL;

// Thunk to fetch published bills to agency
export const fetchPublishedBillsToAgency = createAsyncThunk(
  "publishedBillToAgency/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/published-bill-to-agency`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch published bills"
      );
    }
  }
);

const publishedBillToAgencySlice = createSlice({
  name: "publishedBillToAgency",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearPublishedBillError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublishedBillsToAgency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublishedBillsToAgency.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.data || [];
      })
      .addCase(fetchPublishedBillsToAgency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPublishedBillError } = publishedBillToAgencySlice.actions;

export default publishedBillToAgencySlice.reducer;
