// src/redux/slices/vendorNewspaperSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from '../../utils/axiosInstance'; 

const API_URL = import.meta.env.VITE_PORT_URL;

//  GET: Fetch existing vendor newspaper prices
export const fetchVendorNewspaperPrices = createAsyncThunk(
  "vendorNewspaper/fetchPrices",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/news-paper-rate-get`);
      return response.data.data; // Adjust depending on API structure
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 📝 POST: Submit new prices
export const submitVendorNewspaperPrices = createAsyncThunk(
  "vendorNewspaper/submitPrices",
  async (payload, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/update-paper-rate`, payload);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 🧩 Slice
const vendorNewspaperSlice = createSlice({
  name: "vendorNewspaper",
  initialState: {
    prices: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearVendorPriceState: (state) => {
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder

      // === Fetch Prices ===
      .addCase(fetchVendorNewspaperPrices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorNewspaperPrices.fulfilled, (state, action) => {
        state.loading = false;
        state.prices = action.payload;
      })
      .addCase(fetchVendorNewspaperPrices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch vendor newspaper prices";
      })

      // === Submit Prices ===
      .addCase(submitVendorNewspaperPrices.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(submitVendorNewspaperPrices.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(submitVendorNewspaperPrices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to submit prices";
        state.success = false;
      });
  },
});

export const { clearVendorPriceState } = vendorNewspaperSlice.actions;

export default vendorNewspaperSlice.reducer;
