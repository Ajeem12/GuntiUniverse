import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosInstance';

const API_URL = import.meta.env.VITE_PORT_URL;

// 🔵 Fetch Inactive Clients
export const fetchInactiveClients = createAsyncThunk(
  'customerStatus/fetchInactiveClients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/inactive-client-agency`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch inactive clients');
    }
  }
);

// 🟢 Fetch Active Clients
export const fetchActiveClients = createAsyncThunk(
  'customerStatus/fetchActiveClients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/active-client-agency`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch active clients');
    }
  }
);

// Initial State
const initialState = {
  activeClients: [],
  inactiveClients: [],
  loading: false,
  error: null,
};

// Slice
const customerStatusSlice = createSlice({
  name: 'customerStatus',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔵 Inactive
      .addCase(fetchInactiveClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInactiveClients.fulfilled, (state, action) => {
        state.loading = false;
        state.inactiveClients = action.payload;
      })
      .addCase(fetchInactiveClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🟢 Active
      .addCase(fetchActiveClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveClients.fulfilled, (state, action) => {
        state.loading = false;
        state.activeClients = action.payload;
      })
      .addCase(fetchActiveClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default customerStatusSlice.reducer;
