import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { useAuthStore } from "../../../store/authStore";

const API_URL = import.meta.env.VITE_PORT_URL;

// Define initial state
const initialState = {
  paperChangeRequests: [],
  loading: false,
  error: null,
};

// Thunk to fetch paper change requests
export const getPaperChangeRequests = createAsyncThunk(
  'paperChangeRequest/getPaperChangeRequests',
  async (userId, thunkAPI) => {
    try {
      // Make the API call
       const { token } = useAuthStore.getState(); // Get token at call time
      const response = await axios.get(`${API_URL}/get-paper-change-req-user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data; // return the response data to be used in the reducer
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create the slice
const paperChangeRequestSlice = createSlice({
  name: 'paperChangeRequest',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPaperChangeRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPaperChangeRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.paperChangeRequests = action.payload;
        state.error = null;
      })
      .addCase(getPaperChangeRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default paperChangeRequestSlice.reducer;
