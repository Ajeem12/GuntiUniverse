// redux/payOnBehalfSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance";

const API_URL = import.meta.env.VITE_PORT_URL;


export const payOnBehalf = createAsyncThunk(
  "payment/payOnBehalf",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/vendor-pay-behalf`, payload); 
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Payment failed"
      );
    }
  }
);


export const searchCustomerExist = createAsyncThunk(
  "payment/searchCustomerExist",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/search-customer-exist`, payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Customer search failed"
      );
    }
  }
);

// =====================
// Slice
// =====================
const payOnBehalfSlice = createSlice({
  name: "payOnBehalf",
  initialState: {
    result: [],
    loading: false,
    error: null,
    success: false,

    // For searchCustomerExist
    customerResult: null,
    customerLoading: false,
    customerError: null,
    customerSuccess: false,
  },
  reducers: {
    resetPayOnBehalf: (state) => {
      state.result = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    resetCustomerSearch: (state) => {
      state.customerResult = null;
      state.customerLoading = false;
      state.customerError = null;
      state.customerSuccess = false;
    },
  },
  extraReducers: (builder) => {
    // Pay on Behalf
    builder
      .addCase(payOnBehalf.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(payOnBehalf.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
        state.success = true;
      })
      .addCase(payOnBehalf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });

    // Search Customer Exist
    builder
      .addCase(searchCustomerExist.pending, (state) => {
        state.customerLoading = true;
        state.customerError = null;
        state.customerSuccess = false;
      })
      .addCase(searchCustomerExist.fulfilled, (state, action) => {
        state.customerLoading = false;
        state.customerResult = action.payload;
        state.customerSuccess = true;
      })
      .addCase(searchCustomerExist.rejected, (state, action) => {
        state.customerLoading = false;
        state.customerError = action.payload;
        state.customerSuccess = false;
      });
  },
});

export const { resetPayOnBehalf, resetCustomerSearch } = payOnBehalfSlice.actions;

export default payOnBehalfSlice.reducer;
