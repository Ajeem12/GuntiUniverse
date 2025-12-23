import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axiosInstance'; 


const API_URL = import.meta.env.VITE_PORT_URL;

//  GET all hawkers
export const fetchHawkers = createAsyncThunk(
  'hawker/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/hawker-list`);
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

//  GET hawker by ID
export const fetchHawkerById = createAsyncThunk(
  'hawker/fetchById',
  async (id, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/singleHawker/${id}`);
      return res.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

//  POST (create) new hawker
export const createHawker = createAsyncThunk(
  'hawker/create',
  async (hawkerData, thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}/hawker-reg`, hawkerData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

//  PUT (update) hawker by ID
export const updateHawker = createAsyncThunk(
  'hawker/update',
  async ({ id, updatedData }, thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}/hawker-update/${id}`, updatedData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

//  Initial state
const initialState = {
  hawkers: [],
  singleHawker: null,
  loading: false,
  error: null,
};

const hawkerSlice = createSlice({
  name: 'hawker',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //  Fetch all
      .addCase(fetchHawkers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHawkers.fulfilled, (state, action) => {
        state.loading = false;
        state.hawkers = action.payload;
      })
      .addCase(fetchHawkers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //  Fetch by ID
      .addCase(fetchHawkerById.pending, (state) => {
        state.loading = true;
        state.singleHawker = null;
        state.error = null;
      })
      .addCase(fetchHawkerById.fulfilled, (state, action) => {
        state.loading = false;
        state.singleHawker = action.payload;
      })
      .addCase(fetchHawkerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.singleHawker = null;
      })

      //  Create
      .addCase(createHawker.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHawker.fulfilled, (state, action) => {
        state.loading = false;
        state.hawkers.push(action.payload);
      })
      .addCase(createHawker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //  Update
      .addCase(updateHawker.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateHawker.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const index = state.hawkers.findIndex((h) => h.id === updated.id);
        if (index !== -1) {
          state.hawkers[index] = updated;
        }
      })
      .addCase(updateHawker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default hawkerSlice.reducer;
