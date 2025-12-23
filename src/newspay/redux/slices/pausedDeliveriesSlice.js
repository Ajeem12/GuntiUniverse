import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosInstance'; 

const API_URL = import.meta.env.VITE_PORT_URL;

//  GET: Fetch all paused deliveries
export const fetchPausedDeliveries = createAsyncThunk(
  'pausedDeliveries/fetchPausedDeliveries',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/pause-record-list-agency`); 
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch paused deliveries');
    }
  }
);

//  PUT: Update paused delivery status (e.g., from "Pending" to "Resolved")
export const  rejectPausedDelivery = createAsyncThunk(
  'pausedDeliveries/rejectPausedDelivery',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/cancel-pause-rec`, {  pause_rec_id:id });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update paused delivery status');
    }
  }
);

//  POST: Approve a paused delivery (approve-pause-rec)
export const approvePausedDelivery = createAsyncThunk(
  'pausedDeliveries/approvePausedDelivery',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/approve-pause-rec`, { pause_rec_id:id });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to approve paused delivery');
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
const pausedDeliveriesSlice = createSlice({
  name: 'pausedDeliveries',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //  Fetch
      .addCase(fetchPausedDeliveries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPausedDeliveries.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPausedDeliveries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //  Update paused delivery status
      .addCase(rejectPausedDelivery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectPausedDelivery.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.data = state.data.map((item) =>
          item.id === updated.id ? { ...item, status: updated.status } : item
        );
      })
      .addCase(rejectPausedDelivery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //  Approve paused delivery
      .addCase(approvePausedDelivery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(approvePausedDelivery.fulfilled, (state, action) => {
        state.loading = false;
        const approvedDelivery = action.payload;

        // Update the data with the approved status
        state.data = state.data.map((item) =>
          item.id === approvedDelivery.id ? { ...item, status_rec: 1 } : item // Assuming `status_rec: 1` means "approved"
        );
      })
      .addCase(approvePausedDelivery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default pausedDeliveriesSlice.reducer;
