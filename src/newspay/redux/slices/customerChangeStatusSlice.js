// src/redux/slices/customerChangeStatusSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosInstance'; 


const API_URL = import.meta.env.VITE_PORT_URL;

export const changeCustomerStatus = createAsyncThunk(
  'customer/changeStatus',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/customer-change-status`, data);
      return response.data;
    } catch (error) {
      // Handle errors properly
      return rejectWithValue(
        error.response?.data || { message: 'Something went wrong' }
      );
    }
  }
);

const customerChangeStatusSlice = createSlice({
  name: 'customerChangeStatus',
  initialState: {
    loading: false,
    success: false,
    error: null,
    response: null,
  },
  reducers: {
    resetStatusState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.response = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(changeCustomerStatus.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(changeCustomerStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.response = action.payload;
      })
      .addCase(changeCustomerStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to change customer status';
      });
  },
});

export const { resetStatusState } = customerChangeStatusSlice.actions;
export default customerChangeStatusSlice.reducer;
