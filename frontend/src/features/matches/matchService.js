import axios from 'axios'

const API_URL = '/api/match/' // OK

// const API_URL = process.env.REACT_APP_NODE_ENV === 'production'
//   ? process.env.REACT_APP_SECRET_NAME
//   : '/api/event/';

// Get user match
const getMatch = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL, config)

  return response.data
}


// Create new events
const createMatch = async (matchData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.post(API_URL, matchData, config)

  return response.data
}
// Update events
// const updateMatch = async (matchId, matchData, token) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   }

//   const response = await axios.put(API_URL + matchId, eventData, config)

//   return response.data
// }



const matchService = {
  createMatch,
  // updateMatch,
  getMatch,
}

export default matchService


// function updateDateProperty(obj, property) {
//   if (obj[property]) {
//     const tempDate = new Date(obj[property]);

//     if(property === "createdAt" || property === "updatedAt") {
//       obj[property] = tempDate.toLocaleDateString() + " " + tempDate.getHours() + ":" + tempDate.getMinutes() ;
//     } else {
//       obj[property] = tempDate.toLocaleDateString();
//     }
//   }
// }