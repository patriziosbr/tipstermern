import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'

import matchReducer from '../features/matches/matchSlice'
import matchesReducer from '../features/matchesBet/matchesBetSlice'
import overall from '../features/matchesBet/matchesBetOverAllSlice'



export const store = configureStore({
  reducer: {
    auth: authReducer,

    matches: matchReducer,
    matchBets: matchesReducer,
    overAll: overall,
  },
})
