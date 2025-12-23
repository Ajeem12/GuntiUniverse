// src/redux/slices/newspaperSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const API_URL = import.meta.env.VITE_PORT_URL;

// Async thunk to GET newspapers
export const fetchNewspapers = createAsyncThunk(
  'newspaper/fetchNewspapers',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/news-paper`);
      return response.data.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const newspaperSlice = createSlice({
  name: 'newspaper',
  initialState: {
    newspapers: [],
    loading: false,
    error: null,
  },
  reducers: {
    // You can add reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewspapers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewspapers.fulfilled, (state, action) => {
        state.loading = false;
        state.newspapers = action.payload;
      })
      .addCase(fetchNewspapers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default newspaperSlice.reducer;
