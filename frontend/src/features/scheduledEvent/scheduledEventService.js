import axios from 'axios'

// let API_URL = 'https://notifybeta.onrender.com/api/goals/' // OLD BUT GOLD

// const API_URL = process.env.REACT_APP_NODE_ENV === 'production'
//   ? process.env.REACT_APP_SECRET_NAME
//   : '/api/scheduledEvent/';

let API_URL = 'api/scheduledEvent' // OLD BUT GOLD

// Create new goal
const createscheduledEvent = async (goalData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.post(API_URL, goalData, config)

  return response.data
}

// Get user goals
// const getGoals = async (token) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   }

//   const response = await axios.get(API_URL, config)

//   return response.data
// }


const scheduledEvent = {
    createscheduledEvent,
//   getGoals,
}

export default scheduledEvent
