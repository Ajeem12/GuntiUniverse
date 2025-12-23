

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosInstance'; 

const API_URL = import.meta.env.VITE_PORT_URL;

// GET: Fetch all customer complaints
export const fetchCustomerComplaints = createAsyncThunk(
  'customerComplaints/fetchCustomerComplaints',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/complain-list-agency`); 
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch complaints');
    }
  }
);

//  PUT: Update complaint status (e.g., from "Pending" to "Resolved")
export const updateComplaintStatus = createAsyncThunk(
  'customerComplaints/updateComplaintStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/customer-complaints/${id}`, { status });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update complaint status');
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
const customerComplaintsSlice = createSlice({
  name: 'customerComplaints',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //  Fetch Complaints
      .addCase(fetchCustomerComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCustomerComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //  Update Complaint Status
      .addCase(updateComplaintStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComplaintStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.data = state.data.map((item) =>
          item.id === updated.id ? { ...item, status: updated.status } : item
        );
      })
      .addCase(updateComplaintStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default customerComplaintsSlice.reducer;
