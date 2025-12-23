import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosInstance'; 

// Async thunk for verifying customer
export const verifyCustomer = createAsyncThunk(
  'customer/verifyCustomer',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post('customer-verify', payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Verification failed');
    }
  }
);

const customerVerifySlice = createSlice({
  name: 'customerVerify',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetVerifyState: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(verifyCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetVerifyState } = customerVerifySlice.actions;
export default customerVerifySlice.reducer;
