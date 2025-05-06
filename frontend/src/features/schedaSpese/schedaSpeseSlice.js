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
export const getSchedaSpese = createAsyncThunk(
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

// Create a new SchedaSpese
export const createSchedaSpese = createAsyncThunk(
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

export const updateSchedaSpese = createAsyncThunk(
  'schedaSpese/update',
  async (data, thunkAPI) => {
    // console.log(data, "-------------schedaSpeseschedaSpese----------"); // Debugging
    try {
      const state = thunkAPI.getState();
      const token = state.auth.user.token;
      const schedaId = data.schedaId;
      // Extract the new nota's ID from the response
      const updatePayload = {}
      if(data.notaSpeseData) updatePayload.notaSpese = data.notaSpeseData._id ;
      if(data.titolo) updatePayload.titolo = data.titolo;
      
      // Build the payload to push the new notaSpese ID into the array
      // const updatePayload = {
      //   notaSpese: newNotaSpeseId,
      //   titolo: data.titolo,
      //  };

      return await schedaSpeseService.updateSchedaSpese(schedaId, updatePayload, token);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete SchedaSpese
export const deleteSchedaSpese = createAsyncThunk(
  'schedaSpese/delete',
  async (schedaId, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await schedaSpeseService.deleteSchedaSpese(schedaId, token);
    } catch (error) {
      const message =
        (error.response?.data?.message) || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);



const schedaSpeseSlice = createSlice({
  name: 'schedaSpese',
  initialState,
  reducers: {
    reset: () => ({ ...initialState }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(createSchedaSpese.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createSchedaSpese.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.schedaSpese.unshift(action.payload); // da rivedere forse meglio fare la get dopo la post 
      })
      .addCase(createSchedaSpese.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateSchedaSpese.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSchedaSpese.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const index = state.schedaSpese.findIndex((scheda) => scheda._id === action.payload._id);
        console.log(action.payload, '--------------action.payload'); // Debugging
        if (index !== -1) {
          state.schedaSpese[index] = action.payload;
        }
      })
      .addCase(updateSchedaSpese.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getSchedaSpese.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSchedaSpese.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.schedaSpese = action.payload;
        state.isError = false;
        state.message = '';
      })
      .addCase(getSchedaSpese.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || 'Failed to fetch expense records';
        state.schedaSpese = []; 
      })
      .addCase(deleteSchedaSpese.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteSchedaSpese.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Remove the deleted scheda from the array
        state.schedaSpese = state.schedaSpese.filter(
          (scheda) => scheda._id !== action.payload.id
        );
      })
      .addCase(deleteSchedaSpese.rejected, (state, action) => {
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
