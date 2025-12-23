import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance'; 

//  Fetch profile
export const fetchAgencyProfile = createAsyncThunk(
  'agency/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/agency/profile');
      return res.data.profile;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to fetch profile');
    }
  }
);

//  Update profile
export const updateAgencyProfile = createAsyncThunk(
  'agency/updateProfile',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/news-agency-update', formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to update profile');
    }
  }
);
//  Initial State
const initialState = {
  profile: null,
  loading: false,
  error: null,
  success: false,
   profileFetched: false,
};

// 🔹 Slice
const agencyProfileSlice = createSlice({
  name: 'agency',
  initialState,
  reducers: {
    resetProfileStatus: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(fetchAgencyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAgencyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profileFetched = true; // Mark as fetched
        state.profile = action.payload;
      })
      .addCase(fetchAgencyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // PUT
      .addCase(updateAgencyProfile.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(updateAgencyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.success = true;
      })
      .addCase(updateAgencyProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetProfileStatus } = agencyProfileSlice.actions;
export default agencyProfileSlice.reducer;
