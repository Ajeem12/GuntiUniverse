// src/redux/slices/payNewspaperBillSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance";
import { useAuthStore } from "../../../store/authStore";

const API_URL = import.meta.env.VITE_PORT_URL;

export const payNewspaperBillByCustomer = createAsyncThunk(
  "payNewspaperBill/payNewspaperBillByCustomer",
  async (payload, { rejectWithValue }) => {
    try {
      const { token } = useAuthStore.getState();
      const response = await axios.post(
        `${API_URL}/newspaper-bill-pay-by-customer`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to pay newspaper bill"
      );
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const payNewspaperBillSlice = createSlice({
  name: "payNewspaperBill",
  initialState,
  reducers: {
    resetPayNewspaperBillState: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(payNewspaperBillByCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(payNewspaperBillByCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(payNewspaperBillByCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPayNewspaperBillState } = payNewspaperBillSlice.actions;
export default payNewspaperBillSlice.reducer;
