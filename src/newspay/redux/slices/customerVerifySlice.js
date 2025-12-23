import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosInstance'; 

const API_URL = import.meta.env.VITE_PORT_URL;

// Async thunk for verifying customer
export const verifyCustomer = createAsyncThunk(
  'customer/verifyCustomer',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/customer-verify`, payload);
      
      // Handle different response structures
      const responseData = response.data;
      
      // If the API returns data directly
      if (responseData !== null && typeof responseData === 'object') {
        return responseData;
      }
      
      // If the API returns { data: {...} }
      if (responseData.data) {
        return responseData.data;
      }
      
      // If the API returns a simple message
      return responseData;
      
    } catch (error) {
      // Handle different error response structures
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error ||
                          error.response?.data ||
                          'Verification failed';
      return rejectWithValue(errorMessage);
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