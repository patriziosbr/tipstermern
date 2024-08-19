import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import matchesBetService from './matchesBetService'

const initialState = {
  matches: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Get user events
export const getMatchesBet = createAsyncThunk(
  'match/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await matchesBetService.getMatchesBet(token)
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


// Create new match
export const createMatchesBet = createAsyncThunk(
  'match/create',
  async (matchData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await matchesBetService.createMatchesBet(matchData, token)
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

export const updateEvent = createAsyncThunk(
  'match/update',
  async (data, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.user.token;
      const eventId = data.matchId; // Assuming you pass the eventId as part of the data parameter
      const matchData = {
        ...data.matchData, // Assuming you pass other event data fields in eventData
      };

      return await matchesBetService.updateEvent(eventId, matchData, token);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);




export const matchesBetSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMatchesBet.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createMatchesBet.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.events.push(action.payload)
      })
      .addCase(createMatchesBet.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(updateEvent.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        // Find the index of the existing event in the array
        const index = state.events.findIndex((event) => event._id === action.payload._id)
        if (index !== -1) {
          // Replace the existing event with the updated event
          state.events[index] = action.payload
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getMatchesBet.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getMatchesBet.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.events = action.payload
      })
      .addCase(getMatchesBet.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

  },
})

export const { reset } = matchesBetSlice.actions
export default matchesBetSlice.reducer
