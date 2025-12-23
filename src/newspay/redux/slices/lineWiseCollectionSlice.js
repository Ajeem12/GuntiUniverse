import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance";

const API_URL = import.meta.env.VITE_PORT_URL;

// POST: Submit line-wise collection
export const createLineWiseCollection = createAsyncThunk(
  "lineWiseCollection/create",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/line-wise-collection`,
        formData,
        {}
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Slice
const lineWiseCollectionSlice = createSlice({
  name: "lineWiseCollection",
  initialState: {
    data: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearLineWiseCollectionState: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createLineWiseCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createLineWiseCollection.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Line-wise collection submitted successfully.";
        state.data = action.payload; // <-- update data here
      })

      .addCase(createLineWiseCollection.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to submit line-wise collection.";
      });
  },
});

export const { clearLineWiseCollectionState } = lineWiseCollectionSlice.actions;
export default lineWiseCollectionSlice.reducer;
