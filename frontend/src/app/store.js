import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import notaSpeseReducer from '../features/notaSpese/notaSpeseSlice'



export const store = configureStore({
  reducer: {
    auth: authReducer,
    notaSpese: notaSpeseReducer,
    // matches: matchReducer,
    // matchBets: matchesReducer,
    // overAll: overall,
  },
})
