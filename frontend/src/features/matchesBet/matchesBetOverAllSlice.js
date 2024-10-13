import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import matchesBetService from './matchesBetService';

const initialState = {
  overAll: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};


// Get match bets
export const getMaxWin = createAsyncThunk(
  'matchBets/maxWin',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await matchesBetService.getMaxWin(token);
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);


const matchesBetOverAllSlice = createSlice({
  name: 'overAll',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMaxWin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMaxWin.fulfilled, (state, action) => {
        console.log(action.payload, "action.payload"); 
        state.isLoading = false;
        state.isSuccess = true;
        state.overAll = action.payload;
      })
      .addCase(getMaxWin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      ;
  },
});

export const { reset } = matchesBetOverAllSlice.actions;
export default matchesBetOverAllSlice.reducer;



