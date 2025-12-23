// redux/slices/changePaperRequestSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosInstance'; 


const API_URL = import.meta.env.VITE_PORT_URL;

// GET: Fetch all change paper requests
export const fetchChangeRequests = createAsyncThunk(
  'changePaperRequest/fetchChangeRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/agency-change-paper-req`); 
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch change requests');
    }
  }
);


export const updateChangeRequestStatus = createAsyncThunk(
  'changePaperRequest/updateChangeRequestStatus',
  async (payload, { rejectWithValue }) => {
   
    try {
      const response = await axios.post(`${API_URL}/agency-approved-reject-change-paper`, payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update status');
    }
  }
);


//  Initial state
const initialState = {
  data: [],
  loading: false,
  error: null,
};

//  Slice
const changePaperRequestSlice = createSlice({
  name: 'changePaperRequest',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET - fetchChangeRequests
      .addCase(fetchChangeRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChangeRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchChangeRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // PUT - updateChangeRequestStatus
      .addCase(updateChangeRequestStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateChangeRequestStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.data = state.data.map((item) =>
          item.id === updated.id ? { ...item, status: updated.status } : item
        );
      })
      .addCase(updateChangeRequestStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default changePaperRequestSlice.reducer;
