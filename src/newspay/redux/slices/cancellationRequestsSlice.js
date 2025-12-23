import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance";

const API_URL = import.meta.env.VITE_PORT_URL;

//  GET: Fetch all cancellation requests
export const fetchCancellationRequests = createAsyncThunk(
  "cancellationRequests/fetchCancellationRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/closed-list-agency`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch cancellation requests"
      );
    }
  }
);

//  PUT: Update a specific cancellation request's status
export const updateCancellationStatus = createAsyncThunk(
  "cancellationRequests/updateCancellationStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/cancellation-requests/${id}`, {
        status,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update cancellation status"
      );
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
const cancellationRequestsSlice = createSlice({
  name: "cancellationRequests",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(fetchCancellationRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCancellationRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCancellationRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // PUT
      .addCase(updateCancellationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCancellationStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        state.data = state.data.map((item) =>
          item.id === updated.id ? { ...item, status: updated.status } : item
        );
      })
      .addCase(updateCancellationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cancellationRequestsSlice.reducer;
