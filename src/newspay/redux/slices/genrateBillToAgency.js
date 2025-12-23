import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance";

const API_URL = import.meta.env.VITE_PORT_URL;

// Thunk to fetch published bills to agency
export const fetchGenratedBillsToAgency = createAsyncThunk(
  "genratedBillToAgency/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/gen-bill-to-agency`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch published bills"
      );
    }
  }
);

const genratedBillToAgencySlice = createSlice({
  name: "genratedBillToAgency",
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
      .addCase(fetchGenratedBillsToAgency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGenratedBillsToAgency.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.data || [];
      })
      .addCase(fetchGenratedBillsToAgency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearGenratedBillError } = genratedBillToAgencySlice.actions;

export default genratedBillToAgencySlice.reducer;
