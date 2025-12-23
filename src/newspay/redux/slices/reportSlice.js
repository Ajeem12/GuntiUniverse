import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance";
import { useAuthStore } from "../../../store/authStore";

const API_URL = import.meta.env.VITE_PORT_URL;

// Async Thunk for Fetching Report (GET)
export const fetchReport = createAsyncThunk(
  "report/fetch",
  async (reportId, { rejectWithValue }) => {
    try {
      const { token } = useAuthStore.getState(); // Get token at call time
      const response = await axios.get(`${API_URL}/complain-list-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async Thunk for Creating or Posting Report (POST)
export const createReport = createAsyncThunk(
  "report/create",
  async (reportData, { rejectWithValue }) => {
    try {
      const { token } = useAuthStore.getState(); // Get token at call time
      const response = await axios.post(
        `${API_URL}/pause-news-record`,
        reportData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ); // Endpoint for creating a report
      return response.data; // Assuming the response has the created report data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Report Slice
const reportSlice = createSlice({
  name: "report",
  initialState: {
    data: [], // Store fetched report data
    loading: false, // Loading state for API calls
    error: null, // Error message for failed API calls
  },
  reducers: {
    // You can add extra reducers here for other actions if needed
  },
  extraReducers: (builder) => {
    builder
      // Handle Report fetching state (GET)
      .addCase(fetchReport.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error when starting new fetch
      })
      .addCase(fetchReport.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; // Store fetched report data
      })
      .addCase(fetchReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An unknown error occurred";
      })

      // Handle Report creation state (POST)
      .addCase(createReport.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error when starting new report creation
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.loading = false;
        // If needed, store the created report data
        state.data = action.payload;
      })
      .addCase(createReport.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ||
          "An unknown error occurred while creating the report";
      });
  },
});

// Export actions and reducer
export default reportSlice.reducer;
