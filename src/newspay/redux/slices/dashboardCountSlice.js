import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_PORT_URL;

export const dashboardCount = createAsyncThunk(
  "dashcount/fetchReports",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${API_URL}/dashbaord-count`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch dashboard count"
      );
    }
  }
);

const dashboardCountSlice = createSlice({
  name: "dashcount",
  initialState: {
    count: {},
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(dashboardCount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(dashboardCount.fulfilled, (state, action) => {
        state.loading = false;
        state.count = action.payload;
      })
      .addCase(dashboardCount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardCountSlice.reducer;
