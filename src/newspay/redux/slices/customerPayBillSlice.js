import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { useAuthStore } from "../../../store/authStore";



const API_URL = import.meta.env.VITE_PORT_URL;


// Async thunk for posting bill payment
// export const postCustomerPayBill = createAsyncThunk(
//   'customerPayBill/postCustomerPayBill',
//   async (paymentData, { rejectWithValue }) => {
//     try {
//       // Replace URL with your real API endpoint
//       const { token } = useAuthStore.getState(); // Get token at call time
//       const response = await axios.post(`${API_URL}/customer-pay-bill`, paymentData,{
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//       return response.data; // return data from API on success
//     } catch (err) {
//       // Return error message or entire error object to reducer
//       return rejectWithValue(err.response?.data || err.message);
//     }
//   }
// );

export const postCustomerPayBill = createAsyncThunk(
  'customerPayBill/postCustomerPayBill',
  async (paymentData, { rejectWithValue }) => {
    try {
      const { token } = useAuthStore.getState(); // get token at call time
      const response = await axios.get(
        `${API_URL}/pay-newspaper-bill/${paymentData.bill_id}`,  // <-- dynamic bill ID
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const customerPayBillSlice = createSlice({
  name: 'customerPayBill',
  initialState: {
    loading: false,
    success: false,
    error: null,
    data: null,
  },
  reducers: {
    resetCustomerPayBillState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.data = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(postCustomerPayBill.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(postCustomerPayBill.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.data = action.payload;
      })
      .addCase(postCustomerPayBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to process payment';
        state.success = false;
      });
  }
});

export const { resetCustomerPayBillState } = customerPayBillSlice.actions;

export default customerPayBillSlice.reducer;
