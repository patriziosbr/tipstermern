import axios from 'axios'

const API_URL = '/api/schedaSpese/' // OK

// const API_URL = process.env.REACT_APP_NODE_ENV === 'production'
//   ? process.env.REACT_APP_SECRET_NAME
//   : '/api/event/';

// Get
const getSchedaSpese = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL, config)

  return response.data
}

// Create new events
const createSchedaSpese = async (schedaSpeseData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.post(API_URL, schedaSpeseData, config)

  return response.data
}

// // Update events
const updateSchedaSpese = async (schedaId, schedaData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.put(API_URL + schedaId, schedaData, config)
  return response.data
}

// Delete scheda spese
const deleteSchedaSpese = async (schedaId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.delete(API_URL + schedaId, config)
  return response.data
}

const schedaSpeseService = {
  getSchedaSpese,
  createSchedaSpese,
  updateSchedaSpese,
  deleteSchedaSpese
}

export default schedaSpeseService