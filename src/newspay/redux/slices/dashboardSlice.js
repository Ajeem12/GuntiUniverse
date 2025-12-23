import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance'; 


const initialState = {
  data: null,  
  loading: false,
  error: null,
};


export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async () => {
    try {
      const response = await axiosInstance.get('/vendor-dashboard-agency');  // Adjust the API endpoint as needed
      return response.data.data;  // Return the data from the response
    } catch (error) {
      // Handle any errors that occur during the request
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard data');
    }
  }
);

// Step 3: Create the slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;  // Set loading to true when the fetch starts
        state.error = null;    // Clear previous errors
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;  // Save the fetched data into state
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;  // Handle any errors
      });
  },
});

// Step 4: Export the selector (optional)
export const selectDashboardData = (state) => state.dashboard.data;
export const selectDashboardLoading = (state) => state.dashboard.loading;
export const selectDashboardError = (state) => state.dashboard.error;

// Step 5: Export the reducer to be used in the store
export default dashboardSlice.reducer;
