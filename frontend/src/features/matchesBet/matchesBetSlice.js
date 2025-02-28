import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import matchesBetService from './matchesBetService';

const initialState = {
  matchBets: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};


// Get match bets
export const getMatchBets = createAsyncThunk(
  'matchBets/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await matchesBetService.getMatchesBet(token);
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create new match bet
export const createMatchesBet = createAsyncThunk(
  'matchBets/create',
  async (matchData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await matchesBetService.createMatchesBet(matchData, token);
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete matchBet goal
export const deleteMatchesBet = createAsyncThunk(
  'matchBets/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await matchesBetService.deleteMatchesBet(id, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Update scehdina
export const  updateMatchBet = createAsyncThunk(
  'matchBets/update',
  async (data, thunkAPI) => {
    debugger 
    try {
      const token = thunkAPI.getState().auth.user.token;
      const matchId = data.matchId; // matchId = schedina id
      const matchData = { ...data.matchData };
      return await matchesBetService.updateMatchBet(matchId, matchData, token);
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const matchesBetSlice = createSlice({
  name: 'matchBets',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMatchesBet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createMatchesBet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.matchBets.push(action.payload);
      })
      .addCase(createMatchesBet.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateMatchBet.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateMatchBet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.matchBets.findIndex((bet) => bet._id === action.payload._id);
        if (index !== -1) {
          state.matchBets[index] = action.payload;
        }
      })
      .addCase(updateMatchBet.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getMatchBets.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMatchBets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.matchBets = action.payload;
      })
      .addCase(getMatchBets.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(deleteMatchesBet.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteMatchesBet.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.matchBets = state.matchBets.filter(
          (matchBet) => matchBet._id !== action.payload.id
        )
      })
      .addCase(deleteMatchesBet.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      ;
  },
});

export const { reset } = matchesBetSlice.actions;
export default matchesBetSlice.reducer;

