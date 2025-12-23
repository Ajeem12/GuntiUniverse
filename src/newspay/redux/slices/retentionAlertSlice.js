// redux/retentionAlertSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//  Async thunk to fetch retention alerts
export const fetchRetentionAlerts = createAsyncThunk(
  "retention/fetchAlerts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/retention-alerts"); 
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch retention alerts");
    }
  }
);

const retentionAlertSlice = createSlice({
  name: "retention",
  initialState: {
    alerts: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearRetentionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRetentionAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRetentionAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = action.payload;
      })
      .addCase(fetchRetentionAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRetentionError } = retentionAlertSlice.actions;

export default retentionAlertSlice.reducer;
