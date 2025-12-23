import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// GET: Fetch offers list
export const fetchOffers = createAsyncThunk(
  'offers/fetchOffers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/offers'); 
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch offers');
    }
  }
);

const initialState = {
  data: [],
  loading: false,
  error: null,
};

const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default offersSlice.reducer;
