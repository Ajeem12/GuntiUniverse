import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { useAuthStore } from "../../../store/authStore";

const API_URL = import.meta.env.VITE_PORT_URL;

// Async thunk: pause or stop a report/service
export const pauseNStop = createAsyncThunk(
  "report/pauseNStop",
  async (payload, { rejectWithValue }) => {
    try {
      const { token } = useAuthStore.getState(); // Get token at call time

      const response = await axios.post(
        `${API_URL}/pause-news-record`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const getReports = createAsyncThunk(
  "report/getReports",
  async (_, { rejectWithValue }) => {
    try {
      const { token } = useAuthStore.getState(); // Get token at call time

      const response = await axios.get(`${API_URL}/pause-record-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch reports");
    }
  }
);

// Slice
const reportSlice = createSlice({
  name: "report",
  initialState: {
    loading: false,
    error: null,
    result: null,
    reports: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(getReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(pauseNStop.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.result = null;
      })
      .addCase(pauseNStop.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(pauseNStop.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reportSlice.reducer;
