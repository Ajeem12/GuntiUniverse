import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance";

const API_URL = import.meta.env.VITE_PORT_URL;

//  GET all bills
export const fetchBills = createAsyncThunk(
  "bill/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/generated-bill-agency`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

//  GET bill by ID
export const fetchBillById = createAsyncThunk(
  "bill/fetchById",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

//  POST new bill
export const createBill = createAsyncThunk(
  "bill/create",
  async (newBill, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/bill-generate`, newBill);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

//  PUT (update) bill
export const updateBill = createAsyncThunk(
  "bill/update",
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

//  POST to agency
export const generateBills = createAsyncThunk(
  "bill/generateBills",
  async (billData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/generated-bill-agency`,
        billData
      );
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const billSlice = createSlice({
  name: "bill",
  initialState: {
    bills: [],
    generatedBills: [],
    currentBill: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentBill: (state) => {
      state.currentBill = null;
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Bills
      .addCase(fetchBills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBills.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.bills = action.payload;
        } else {
          state.error = "Unexpected data format received for bills";
        }
      })
      .addCase(fetchBills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch bills.";
      })

      // Fetch Bill By ID
      .addCase(fetchBillById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentBill = null;
      })
      .addCase(fetchBillById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBill = action.payload || null;
      })
      .addCase(fetchBillById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch bill by ID.";
      })

      // Create Bill
      .addCase(createBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBill.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && typeof action.payload === "object") {
          state.bills.push(action.payload); // Push new bill to the array
        } else {
          state.error = "Invalid payload structure for new bill.";
        }
      })
      .addCase(createBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create bill.";
      })

      // Update Bill
      .addCase(updateBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBill.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bills.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.bills[index] = action.payload; // Update the bill in the array
        }
      })
      .addCase(updateBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update bill.";
      })

      // Generate Bills for Agency
      .addCase(generateBills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateBills.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.generatedBills = action.payload; // Store generated bills as an array
        } else {
          state.error = "Unexpected data format for generated bills.";
        }
      })
      .addCase(generateBills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to generate bills.";
      });
  },
});

export const { clearCurrentBill, resetError } = billSlice.actions;
export default billSlice.reducer;
