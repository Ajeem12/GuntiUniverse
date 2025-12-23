import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { useAuthStore } from "../../../store/authStore";
// Define your API URL
const API_URL = import.meta.env.VITE_PORT_URL;

// Define the initial state for the calendar slice
const initialState = {
  events: [],
  loading: false,
  error: null,
};

// Define the async thunk to fetch events based on agency and paper
export const fetchEvents = createAsyncThunk(
  'calendar/fetchEvents',
  async (data, thunkAPI) => {
    try {
        const { token } = useAuthStore.getState();
      const response = await axios.post(
        `${API_URL}/get-paper-calander`,  // Replace with your actual endpoint
        data,  // Send agency_id and paper_id
        {
          headers: {
           
             Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data;  // Return event data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);  // Handle error if API call fails
    }
  }
);

// Create a slice for calendar
const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;  // Update the state with fetched events
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;  // Store error if API call fails
      });
  },
});

export default calendarSlice.reducer;
