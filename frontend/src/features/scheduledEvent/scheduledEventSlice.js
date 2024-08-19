import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import scheduledEventService from './scheduledEventService'

const initialState = {
  goals: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Create new goal
export const createScheduledEvent = createAsyncThunk(
  'scheduledEvent/create',
  async (scheduledEventData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await scheduledEventService.createscheduledEvent(scheduledEventData, token)
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

export const scheduledEventSlice = createSlice({
  name: 'scheduledEvent',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createScheduledEvent.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createScheduledEvent.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.goals.push(action.payload)
      })
      .addCase(createScheduledEvent.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})

export const { reset } = scheduledEventSlice.actions
export default scheduledEventSlice.reducer
