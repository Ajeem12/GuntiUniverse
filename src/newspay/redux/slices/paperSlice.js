// src/redux/slices/paperSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { useAuthStore } from "../../../store/authStore";
// Define your API URL
const API_URL = import.meta.env.VITE_PORT_URL;

export const getPaperRecordsByAgency = createAsyncThunk(
  'papers/getPaperRecordsByAgency',
  async (agencyId, { rejectWithValue }) => {
    try {
      // Make the POST request with the agencyId as part of the payload
       const { token } = useAuthStore.getState();
      const response = await axios.get(`${API_URL}/get-paper-rec-by-agency`,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      return response.data.data; // Return the data on success
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong'); // Handle errors
    }
  }
);

// Create the slice
const paperSlice = createSlice({
  name: 'papers',
  initialState: {
    loading: false,
    records: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPaperRecordsByAgency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaperRecordsByAgency.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload; // Store the fetched records
      })
      .addCase(getPaperRecordsByAgency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store the error message
      });
  },
});

export default paperSlice.reducer;
