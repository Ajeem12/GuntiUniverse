import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { useAuthStore } from "../../../store/authStore";

const API_URL = import.meta.env.VITE_PORT_URL;

//  GET all change paper requests
export const fetchChangeRequests = createAsyncThunk(
  'changePaper/fetchChangeRequests',
  async (_, thunkAPI) => {
    try {
         const { token } = useAuthStore.getState(); // Get token at call time
      const response = await axios.get(`${API_URL}/customer-paper-rec`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// POST new change paper request
export const createChangeRequest = createAsyncThunk(
  'changePaper/createChangeRequest',
  async (requestData, thunkAPI) => {
    try {
      const { token } = useAuthStore.getState(); // Get token at call time
      const response = await axios.post(`${API_URL}/change-paper-user`, requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

//  Slice
const changePaperSlice = createSlice({
  name: 'changePaper',
  initialState: {
    requests: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(fetchChangeRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChangeRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(fetchChangeRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // POST
      .addCase(createChangeRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChangeRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.requests.unshift(action.payload); // Add new on top
      })
      .addCase(createChangeRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default changePaperSlice.reducer;
