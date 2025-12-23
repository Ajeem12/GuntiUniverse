import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const API_URL = import.meta.env.VITE_PORT_URL;

export const fetchLineData = createAsyncThunk(
  'line/fetchData', 
  async (lineId, { rejectWithValue }) => {
    try {
     
      const response = await axios.get(`${API_URL}/line_master`);

    
      return response.data.data; 
    } catch (error) {
    
      return rejectWithValue(error.response?.data?.message || error.message || 'Something went wrong');
    }
  }
);

// Step 2: Create the slice for managing state related to "Line"
const lineSlice = createSlice({
  name: 'line',
  initialState: {
    lineData: null, // For storing line data
    loading: false, // To track loading state
    error: null, // To store error messages
  },
  reducers: {
    // You can add any regular reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLineData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLineData.fulfilled, (state, action) => {
        state.loading = false;
        state.lineData = action.payload; // Storing fetched data
      })
      .addCase(fetchLineData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error fetching line data';
      });
  }
});

// Export the reducer (use it in your store)
export default lineSlice.reducer;
