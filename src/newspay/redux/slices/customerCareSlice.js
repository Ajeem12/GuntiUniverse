import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { useAuthStore } from "../../../store/authStore";
// Define your API URL
const API_URL = import.meta.env.VITE_PORT_URL;

// Async thunk to get customer care information
export const getCustomerCareInfo = createAsyncThunk(
  'customerCare/getCustomerCareInfo',
  async (customerId, { rejectWithValue }) => {
    try {
     const { token } = useAuthStore.getState(); // Get token at call time
      const response = await axios.get(`${API_URL}/customer-care-details`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
    );
      return response.data.data;  // Assuming the response contains the data we need
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Error fetching customer care info');
    }
  }
);

// Initial state for customer care
const initialState = {
  customerCareInfo: null,  // Will hold the fetched customer care info
  loading: false,
  error: null,
  success: false
};

// Slice for customer care
const customerCareSlice = createSlice({
  name: 'customerCare',
  initialState,
  reducers: {
    resetCustomerCareState: (state) => {
      state.customerCareInfo = null;
      state.error = null;
      state.loading = false;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCustomerCareInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getCustomerCareInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.customerCareInfo = action.payload; // Storing fetched data
        state.success = true;
      })
      .addCase(getCustomerCareInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store error message if request fails
      });
  }
});

// Export actions
export const { resetCustomerCareState } = customerCareSlice.actions;

// Export the reducer to be used in the store
export default customerCareSlice.reducer;
