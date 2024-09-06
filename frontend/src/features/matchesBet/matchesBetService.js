import axios from 'axios'

const API_URL = '/api/matchesBet/' // OK

// const API_URL = process.env.REACT_APP_NODE_ENV === 'production'
//   ? process.env.REACT_APP_SECRET_NAME
//   : '/api/event/';

// Get user match
const getMatchesBet = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL, config)

  return response.data
}


// Create new events
const createMatchesBet = async (matchData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.post(API_URL, matchData, config)

  return response.data
}

// Delete user goal
const deleteMatchesBet = async (matchBetId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.delete(API_URL + matchBetId, config)

  return response.data
}
// Update events
const updateMatchBet = async (matchId, matchData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(API_URL + matchId, matchData, config)

  return response.data
}



const matchesBetService = {
  createMatchesBet,
  updateMatchBet,
  getMatchesBet,
  deleteMatchesBet
}

export default matchesBetService


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