// src/redux/slices/customerPaperRecSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosInstance'; // your axios instance
import { useAuthStore } from "../../../store/authStore";
const API_URL = import.meta.env.VITE_PORT_URL;

// Async thunk for fetching customer-paper-rec records
export const fetchCustomerPaperRecs = createAsyncThunk(
  'customerPaperRec/fetchAll',
  async (_, thunkAPI) => {
    try {

         const { token } = useAuthStore.getState(); // Get token at call time
      const response = await axios.get(`${API_URL}/customer-paper-rec`,
         {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data; // adjust if structure differs
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
const customerPaperRecSlice = createSlice({
  name: 'customerPaperRec',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCustomerPaperRec: (state) => {
      state.data = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerPaperRecs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerPaperRecs.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCustomerPaperRecs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCustomerPaperRec } = customerPaperRecSlice.actions;
export default customerPaperRecSlice.reducer;
