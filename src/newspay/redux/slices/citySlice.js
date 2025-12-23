// src/redux/slices/citySlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance";


const API_URL = import.meta.env.VITE_PORT_URL;


export const fetchCities = createAsyncThunk(
  "cities/fetchCities",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/get-cities_new`);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch cities");
    }
  }
);

const initialState = {
  cities: [],
  loading: false,
  error: null,
};

const citySlice = createSlice({
  name: "cities",
  initialState,
  reducers: {
    
    resetCityState: (state) => {
      state.cities = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = action.payload;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCityState } = citySlice.actions;
export default citySlice.reducer;
