// src/redux/slices/customerChangePaperRecSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { useAuthStore } from "../../../store/authStore";

const API_URL = import.meta.env.VITE_PORT_URL;

// Async thunk to fetch data
export const fetchCustomerChangePaperRecs = createAsyncThunk(
  "customerChangePaperRec/fetchCustomerChangePaperRecs",
  async (_, { rejectWithValue }) => {
    try {
      const { token } = useAuthStore.getState(); // Get token at call time
      const response = await axios.get(`${API_URL}/customer-change-paper-rec`,
         {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const customerChangePaperRecSlice = createSlice({
  name: "customerChangePaperRec",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Add any sync reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomerChangePaperRecs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerChangePaperRecs.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCustomerChangePaperRecs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch data";
      });
  },
});

export default customerChangePaperRecSlice.reducer;
