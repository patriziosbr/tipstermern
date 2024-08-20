import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import goalReducer from '../features/goals/goalSlice' //buttare
import eventReducer from '../features/events/eventSlice' //buttare
import foodReducer from '../features/foods/foodSlice' //buttare

import matchReducer from '../features/matches/matchSlice'
import matchesReducer from '../features/matchesBet/matchesBetSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    goals: goalReducer,
    events : eventReducer,
    foods: foodReducer,
    matches: matchReducer,
    matchBets: matchesReducer
  },
})
