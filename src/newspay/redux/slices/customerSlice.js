import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosInstance'; 

const API_URL = import.meta.env.VITE_PORT_URL;

//  GET all customers
export const fetchCustomers = createAsyncThunk(
  'customer/fetchCustomers',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/customer-list`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 📤 POST a new customer
export const createCustomer = createAsyncThunk(
  'customer/createCustomer',
  async (newCustomer, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/customer-reg`, newCustomer);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const updateCustomer = createAsyncThunk(
  'customer/updateCustomer',
  async ({ id, payload }, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/customer-update/${id}`, payload);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 🔍 GET single customer by ID
export const fetchCustomerById = createAsyncThunk(
  'customer/fetchCustomerById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/single-customer/${id}`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

const customerSlice = createSlice({
  name: 'customer',
  initialState: {
    customers: [],
    singleCustomer: null, 
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //  Fetch all customers
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ➕ Create customer
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers.push(action.payload);
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔄 Update customer
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.customers.findIndex((c) => c.id === updated.id);
        if (index !== -1) {
          state.customers[index] = updated;
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔍 Fetch customer by ID
      .addCase(fetchCustomerById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.singleCustomer = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleCustomer = action.payload;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.singleCustomer = null;
      });
  },
});

export default customerSlice.reducer;
