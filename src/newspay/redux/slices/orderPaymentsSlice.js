import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { useAuthStore } from "../../../store/authStore";

const API_URL = import.meta.env.VITE_PAY_URL;

// Async action to fetch new order payment stats by orderId
export const fetchNewOrderPayments = createAsyncThunk(
  'orderPayments/fetchNewOrderPayments',
  async (orderId, { rejectWithValue }) => {
    try {
      const { token } = useAuthStore.getState(); // Get token at call time
      const response = await axios.get(`${API_URL}/get_news_paper_status/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // if needed
        },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || 'Something went wrong');
      } else {
        return rejectWithValue(error.message || 'Network error');
      }
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const orderPaymentsSlice = createSlice({
  name: 'orderPayments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewOrderPayments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNewOrderPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchNewOrderPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default orderPaymentsSlice.reducer;
