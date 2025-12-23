import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { useAuthStore } from "../../../store/authStore";
import axios from "axios";

const API_URL = import.meta.env.VITE_PORT_URL;

// Async thunk to fetch customer bills by newspaper ID
export const fetchCustomerBillsByNewspaper = createAsyncThunk(
  'customerBillByNewspaper/fetchById',
  async (newspaperId, thunkAPI) => {
    try {
      const { token } = useAuthStore.getState(); // Get token at call time
      const response = await axios.get(`${API_URL}/get-customer-bill-news-paper-wise/${newspaperId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data; // adjust if needed based on your API response
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const customerBillByNewspaperSlice = createSlice({
  name: 'customerBillByNewspaper',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCustomerBillData: (state) => {
      state.data = [];
      state.error = null;
    },
    // Reset Payment State
    resetPaymentState: (state) => {
      // You can adjust the state reset logic as needed
      state.data = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerBillsByNewspaper.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerBillsByNewspaper.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCustomerBillsByNewspaper.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCustomerBillData, resetPaymentState } = customerBillByNewspaperSlice.actions;
export default customerBillByNewspaperSlice.reducer;
