import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axiosInstance";

const API_URL = import.meta.env.VITE_PORT_URL;

// 1. Fetch all newspaper languages
export const fetchNewspaperLanguages = createAsyncThunk(
  "newspaperLanguage/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/news-paper-language`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 2. Fetch a specific newspaper language by ID
export const fetchNewspaperLanguageById = createAsyncThunk(
  "newspaperLanguage/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/news-paper-language-wise/${id}`
      );
      return response.data.data; // Returning the fetched data
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state for the slice
const initialState = {
  languages: [], // Array to store all newspaper languages
  selectedLanguage: [], // Store a single language when fetching by ID
  loading: false, // Loading state
  error: null, // Error state
};

// Slice for handling newspaper language state
const newspaperLanguageSlice = createSlice({
  name: "newspaperLanguage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handling the async actions (thunks)

    // Fetching all languages
    builder
      .addCase(fetchNewspaperLanguages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewspaperLanguages.fulfilled, (state, action) => {
        state.loading = false;
        state.languages = action.payload; // Store fetched languages
      })
      .addCase(fetchNewspaperLanguages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch languages";
      });

    // Fetching a language by ID
    builder
      .addCase(fetchNewspaperLanguageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewspaperLanguageById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedLanguage = action.payload; // Store the selected language
      })
      .addCase(fetchNewspaperLanguageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch language";
      });
  },
});

export default newspaperLanguageSlice.reducer;
