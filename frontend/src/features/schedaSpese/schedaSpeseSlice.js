import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import schedaSpeseService from './schedaSpeseService';

const initialState = {
  schedaSpese: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get schedaSpese
export const getSchedaSpeseService = createAsyncThunk(
  'schedaSpese/get',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await schedaSpeseService.getSchedaSpese(token);
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create a new match
export const createSchedaSpeseService = createAsyncThunk(
  'schedaSpese/create',
  async (schedaSpeseData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await schedaSpeseService.createSchedaSpese(schedaSpeseData, token);
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update match
// export const updateBudget = createAsyncThunk(
//   'match/update',
//   async (data, thunkAPI) => {
//     if(data.body) {
//       try {
//         const token = thunkAPI.getState().auth.user.token;
//         const matchId = data.matchId;
//         const matchData = data.body;
//         return await budgetService.updateBudget(matchId, matchData, token);
//       } catch (error) {
//         const message =
//           (error.response?.data?.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//       }
//     } else {
//       try {
//         const token = thunkAPI.getState().auth.user.token;
//         const updatedBudgetes = await Promise.all(
//           data.map(async (match) => {
//             const matchId = match.matchId;
//             const matchData = match;
//             return await budgetService.updateBudget(matchId, matchData, token);
//           })
//         );
//         return updatedBudgetes;
//       } catch (error) {
//         const message =
//           (error.response?.data?.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//       }
//     }
//   }
// );

const schedaSpeseSlice = createSlice({
  name: 'schedaSpese',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSchedaSpeseService.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSchedaSpeseService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.schedaSpese.push(action.payload);
      })
      .addCase(createSchedaSpeseService.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // .addCase(updateBudget.pending, (state) => {
      //   state.isLoading = true;
      // })
      // .addCase(updateBudget.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   state.isSuccess = true;
      //   const index = state.matches.findIndex((match) => match._id === action.payload._id);
      //   if (index !== -1) {
      //     state.matches[index] = action.payload;
      //   }
      // })
      // .addCase(updateBudget.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.isError = true;
      //   state.message = action.payload;
      // })
      .addCase(getSchedaSpeseService.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSchedaSpeseService.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.schedaSpese = action.payload;
      })
      .addCase(getSchedaSpeseService.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = schedaSpeseSlice.actions;
export default schedaSpeseSlice.reducer;



// export const updateEvent = createAsyncThunk(
//   'match/update',
//   async (data, thunkAPI) => {
//     try {
//       const state = thunkAPI.getState();
//       const token = state.auth.user.token;
//       const eventId = data.matchId; // Assuming you pass the eventId as part of the data parameter
//       const matchData = {
//         ...data.matchData, // Assuming you pass other event data fields in eventData
//       };

//       return await budgetService.updateEvent(eventId, matchData, token);
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );
