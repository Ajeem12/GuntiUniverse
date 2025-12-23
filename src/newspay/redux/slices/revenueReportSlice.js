import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_PORT_URL;

export const fetchRevenueReports = createAsyncThunk(
  "revenue/fetchReports",
  async (payload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.post(
        `${API_URL}/revenu-report`,
        {
          year: payload.year,
          line: payload.line,
          language: payload.language,
          news_paper_id: payload.newspaper_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch revenue reports"
      );
    }
  }
);

const revenueReportSlice = createSlice({
  name: "revenue",
  initialState: {
    reports: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearRevenueError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRevenueReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRevenueReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchRevenueReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRevenueError } = revenueReportSlice.actions;
export default revenueReportSlice.reducer;
