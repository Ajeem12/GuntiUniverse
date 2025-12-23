import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { useAuthStore } from "../../../store/authStore";

const API_URL = import.meta.env.VITE_PORT_URL;

// GET: Fetch transaction history
export const fetchTransactionHistory = createAsyncThunk(
  "transactionHistory/fetchTransactionHistory",
  async (_, { rejectWithValue }) => {
    try {
      const { token } = useAuthStore.getState(); // Get token at call time
      const response = await axios.get(`${API_URL}/customer-payment-histroy`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch transaction history"
      );
    }
  }
);

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const transactionHistorySlice = createSlice({
  name: "transactionHistory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchTransactionHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default transactionHistorySlice.reducer;
