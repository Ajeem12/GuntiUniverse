// vendorPayoutSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance";

const API_URL = import.meta.env.VITE_PORT_URL;


export const fetchVendorPayoutReports = createAsyncThunk(
  "vendorPayout/fetchReports",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/get-paid-by-gunti`, payload);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch reports");
    }
  }
);

const vendorPayoutSlice = createSlice({
  name: "vendorPayout",
  initialState: {
    reports: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearVendorPayoutError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendorPayoutReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorPayoutReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload; 
      })
      .addCase(fetchVendorPayoutReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearVendorPayoutError } = vendorPayoutSlice.actions;
export default vendorPayoutSlice.reducer;
