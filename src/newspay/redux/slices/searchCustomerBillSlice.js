import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { useAuthStore } from "../../../store/authStore";

const API_URL = import.meta.env.VITE_PORT_URL;
// Async thunk for POSTing mobile number to search customer bill
export const searchCustomerBill = createAsyncThunk(
  'customerBill/search',
  async (payload, { rejectWithValue }) => {
    try {
       const { token } = useAuthStore.getState();  
      const response = await axios.post(`${API_URL}/search-customer-bill`, payload,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      return response.data;
    } catch (error) {
      // return custom error message
      return rejectWithValue(
        error.response?.data?.message || 'Failed to search customer bill'
      );
    }
  }
);

const searchCustomerBillSlice = createSlice({
  name: 'searchCustomerBill',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSearchBillState: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchCustomerBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCustomerBill.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data; // Adjust if your response is wrapped
      })
      .addCase(searchCustomerBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSearchBillState } = searchCustomerBillSlice.actions;

export default searchCustomerBillSlice.reducer;
