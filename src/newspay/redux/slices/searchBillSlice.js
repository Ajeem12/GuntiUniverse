// src/redux/slices/searchBillSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_PORT_URL;

export const searchBillGenerate = createAsyncThunk(
  "searchBill/search",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/search-bill-generate`,
        payload
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchBillList = createAsyncThunk(
  "searchBill/fetchList",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/search-bill-generate`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCreatedBills = createAsyncThunk(
  "searchBill/fetchCreatedBills",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/created-bill-fetch`,
        payload
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCreatedBill = createAsyncThunk(
  "searchBill/updateCreatedBill",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/created-bill-edit`,
        payload
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateParticularBill = createAsyncThunk(
  "searchBill/updateParticularBill",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/particular-bill-edit`,
        payload
      );

      return response.data.data; // Adjust if the API returns differently
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  data: [],
  list: [],
  createdBills: [],
  loading: false,
  error: null,
};

const searchBillSlice = createSlice({
  name: "searchBill",
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.data = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchBillGenerate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchBillGenerate.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(searchBillGenerate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(fetchBillList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBillList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchBillList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch bill list";
      })
      .addCase(fetchCreatedBills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCreatedBills.fulfilled, (state, action) => {
        state.loading = false;
        state.createdBills = action.payload;
      })
      .addCase(fetchCreatedBills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch created bills";
      });
    builder
      // ... existing cases

      .addCase(updateCreatedBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCreatedBill.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update `createdBills` or `data` if you want to keep state in sync
        // For example, find and update the edited bill in createdBills:
        const updatedBill = action.payload;
        const index = state.createdBills.findIndex(
          (bill) => bill.id === updatedBill.id
        );
        if (index !== -1) {
          state.createdBills[index] = updatedBill;
        }
      })
      .addCase(updateCreatedBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update created bill";
      })
      .addCase(updateParticularBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateParticularBill.fulfilled, (state, action) => {
        state.loading = false;
        const updatedBill = action.payload;
        const index = state.createdBills.findIndex(
          (bill) => bill.id === updatedBill.id
        );
        if (index !== -1) {
          state.createdBills[index] = updatedBill;
        }
      })
      .addCase(updateParticularBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update particular bill";
      });
  },
});

export const { clearSearchResults } = searchBillSlice.actions;

export default searchBillSlice.reducer;
