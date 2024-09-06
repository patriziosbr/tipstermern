import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import matchService from './matchService';

const initialState = {
  matches: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get matches
export const getMatch = createAsyncThunk(
  'matches/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await matchService.getMatch(token);
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create a new match
export const createMatch = createAsyncThunk(
  'matches/create',
  async (matchData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await matchService.createMatch(matchData, token);
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update match
export const updateMatch = createAsyncThunk(
  'match/update',
  async (data, thunkAPI) => {
    console.log(data, "data");
    
    try {
      const token = thunkAPI.getState().auth.user.token;
      const matchId = data.matchId;
      const matchData = data.body;
      return await matchService.updateMatch(matchId, matchData, token);
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const matchSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createMatch.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createMatch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.matches.push(action.payload);
      })
      .addCase(createMatch.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateMatch.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateMatch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.matches.findIndex((match) => match._id === action.payload._id);
        if (index !== -1) {
          state.matches[index] = action.payload;
        }
      })
      .addCase(updateMatch.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getMatch.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMatch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.matches = action.payload;
      })
      .addCase(getMatch.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = matchSlice.actions;
export default matchSlice.reducer;


// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import matchService from './matchService'

// const initialState = {
//   matches: [],
//   isError: false,
//   isSuccess: false,
//   isLoading: false,
//   message: '',
// }

// // Get user events
// export const getMatch = createAsyncThunk(
//   'match/getAll',
//   async (_, thunkAPI) => {
//     try {
//       const token = thunkAPI.getState().auth.user.token
//       return await matchService.getMatch(token)
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString()
//       return thunkAPI.rejectWithValue(message)
//     }
//   }
// )


// // Create new match
// export const createMatch = createAsyncThunk(
//   'match/create',
//   async (matchData, thunkAPI) => {
//     try {
//       const token = thunkAPI.getState().auth.user.token
//       return await matchService.createMatch(matchData, token)
//     } catch (error) {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString()
//       return thunkAPI.rejectWithValue(message)
//     }
//   }
// )

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

//       return await matchService.updateEvent(eventId, matchData, token);
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




// export const matchSlice = createSlice({
//   name: 'matches',
//   initialState,
//   reducers: {
//     reset: (state) => initialState,
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(createMatch.pending, (state) => {
//         state.isLoading = true
//       })
//       .addCase(createMatch.fulfilled, (state, action) => {
//         state.isLoading = false
//         state.isSuccess = true
//         state.matches.push(action.payload)
//       })
//       .addCase(createMatch.rejected, (state, action) => {
//         state.isLoading = false
//         state.isError = true
//         state.message = action.payload
//       })
//       .addCase(updateEvent.pending, (state) => {
//         state.isLoading = true
//       })
//       .addCase(updateEvent.fulfilled, (state, action) => {
//         state.isLoading = false
//         state.isSuccess = true
//         // Find the index of the existing event in the array
//         const index = state.matches.findIndex((event) => event._id === action.payload._id)
//         if (index !== -1) {
//           // Replace the existing event with the updated event
//           state.matches[index] = action.payload
//         }
//       })
//       .addCase(updateEvent.rejected, (state, action) => {
//         state.isLoading = false
//         state.isError = true
//         state.message = action.payload
//       })
//       .addCase(getMatch.pending, (state) => {
//         state.isLoading = true
//       })
//       .addCase(getMatch.fulfilled, (state, action) => {
//         state.isLoading = false
//         state.isSuccess = true
//         state.matches = action.payload
//       })
//       .addCase(getMatch.rejected, (state, action) => {
//         state.isLoading = false
//         state.isError = true
//         state.message = action.payload
//       })

//   },
// })

// export const { reset } = matchSlice.actions
// export default matchSlice.reducer
