import axios from 'axios'
import { toast } from 'react-toastify'

const API_URL = '/api/notaSpese/' // OK

// const API_URL = process.env.REACT_APP_NODE_ENV === 'production'
//   ? process.env.REACT_APP_SECRET_NAME
//   : '/api/event/';

// Get
const getNotaSpese = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL, config)

  return response.data
}

// Create new events
const createNotaSpese = async (notaSpeseData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.post(API_URL, notaSpeseData, config)

  return response.data
}

// // Update events
// const updateNotaSpese = async (BudgetId, BudgetData, token) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   }

//   const response = await axios.put(API_URL + BudgetId, BudgetData, config)

//   return response.data
// }



const notaSpeseService = {
  getNotaSpese,
  createNotaSpese,
}

export default notaSpeseService