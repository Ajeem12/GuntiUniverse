// settlementReportSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../utils/axiosInstance';

const API_URL = import.meta.env.VITE_PORT_URL;

// POST: Fetch settlement reports with optional payload (e.g., filters)
export const fetchSettlementReports = createAsyncThunk(
  "settlement/fetchReports",
  async (payload = {}, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/settlement-report`, payload);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch settlement reports");
    }
  }
);

const settlementReportSlice = createSlice({
  name: "settlement",
  initialState: {
    reports: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSettlementError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettlementReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettlementReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchSettlementReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSettlementError } = settlementReportSlice.actions;
export default settlementReportSlice.reducer;
