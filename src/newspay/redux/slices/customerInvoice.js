import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance";

const API_URL = import.meta.env.VITE_PORT_URL;

// Thunk to fetch published bills to agency
export const fetchCustomerInvoice = createAsyncThunk(
  "customerInvoice/fetch",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/created-bill-fetch`,
        payload
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch published bills"
      );
    }
  }
);

const genrateCutomerInvoiceSlice = createSlice({
  name: "customerInvoice",
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
      .addCase(fetchCustomerInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload?.data || [];
      })
      .addCase(fetchCustomerInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearGenratedBillError } = genrateCutomerInvoiceSlice.actions;

export default genrateCutomerInvoiceSlice.reducer;
