// src/redux/slices/languageSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_PORT_URL;

//  GET: Fetch all languages
export const fetchLanguages = createAsyncThunk(
  'languages/fetchLanguages',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/news-paper-language`);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

//  Slice
const languageSlice = createSlice({
  name: 'languages',
  initialState: {
    languages: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLanguages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLanguages.fulfilled, (state, action) => {
        state.loading = false;
        state.languages = action.payload;
      })
      .addCase(fetchLanguages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default languageSlice.reducer;
