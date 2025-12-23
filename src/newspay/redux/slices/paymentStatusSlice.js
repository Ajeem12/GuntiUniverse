// redux/paymentStatusSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance";

const API_URL = import.meta.env.VITE_PORT_URL;
// Async thunk to fetch payment status
export const fetchPaymentStatus = createAsyncThunk(
  "paymentStatus/fetch",
  async (params, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/manage-generated-bill`, {
        params,
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch payment status"
      );
    }
  }
);

const paymentStatusSlice = createSlice({
  name: "paymentStatus",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearPaymentStatusError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaymentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPaymentStatusError } = paymentStatusSlice.actions;

export default paymentStatusSlice.reducer;
