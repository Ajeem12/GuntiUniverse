import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_PORT_URL;

// Utility: safely parse JSON from localStorage
const getStoredUser = () => {
  try {
    const stored = localStorage.getItem('authUser');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

// ✅ Async Thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/agency/login`, credentials);
      const { token, data: user } = response.data;

      // Save to localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(user));

      return { token, user };
    } catch (err) {
      if (err.response?.data) {
        return rejectWithValue(err.response.data);
      } else {
        return rejectWithValue({ message: 'Something went wrong!' });
      }
    }
  }
);

// 🔹 Initial state
const initialState = {
  user: getStoredUser(),
  token: localStorage.getItem('authToken') || null,
  loading: false,
  error: null,
  success: false,
};

// 🔸 Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      state.user = null;
      state.token = null;
      state.error = null;
      state.success = false;
    },
    resetAuthStatus: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.success = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      });
  },
});

export const { logout, resetAuthStatus } = authSlice.actions;

export default authSlice.reducer;
