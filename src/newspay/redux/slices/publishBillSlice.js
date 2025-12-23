import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosInstance'; 

const API_URL = import.meta.env.VITE_PORT_URL;  


export const publishBillAgency = createAsyncThunk(
  'bill/publishBillAgency',  // Slice name
  async (billData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/publish-bill-agency`, billData);  
      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response.data); 
    }
  }
);


const billSlice = createSlice({
  name: 'bill',  // Slice name
  initialState: {
    publishStatus: 'idle', 
    publishedBill: null,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(publishBillAgency.pending, (state) => {
        state.publishStatus = 'loading';
      })
      .addCase(publishBillAgency.fulfilled, (state, action) => {
        state.publishStatus = 'succeeded';
        state.publishedBill = action.payload;  
      })
      .addCase(publishBillAgency.rejected, (state, action) => {
        state.publishStatus = 'failed';
        state.error = action.payload || 'Failed to publish bill';  
      });
  },
});

export default billSlice.reducer;
