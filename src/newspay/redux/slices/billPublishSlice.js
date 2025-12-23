import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance";

const API_URL = import.meta.env.VITE_PORT_URL;

export const publishBillAgency = createAsyncThunk(
  "billPublish/publishBillAgency",
  async (payload, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/publish-bill-agency`, payload);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const billPublishSlice = createSlice({
  name: "billPublish",
  initialState: {
    loading: false,
    error: null,
    success: false,
    message: "",
  },
  reducers: {
    resetPublishStatus: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(publishBillAgency.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(publishBillAgency.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload?.message || "Bill published successfully.";
      })
      .addCase(publishBillAgency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to publish bill.";
        state.success = false;
      });
  },
});

export const { resetPublishStatus } = billPublishSlice.actions;
export default billPublishSlice.reducer;
