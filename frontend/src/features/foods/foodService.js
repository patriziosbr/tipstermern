import axios from 'axios'

const API_URL = 'api/foods/' // OK

// const API_URL = process.env.REACT_APP_NODE_ENV === 'production'
//   ? process.env.REACT_APP_SECRET_NAME
//   : '/api/event/';

// Get user events
const getFoods = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL, config)

  return response.data

  // if(response.data.message) {
  //   console.log('no foods in db');
  // } else {
  //   response.data.forEach(food => {
  //     updateDateProperty(food, "startAt")
  //     updateDateProperty(food, "endAt")
  //     updateDateProperty(food, "createdAt")
  //     updateDateProperty(food, "updatedAt")
  //   });
  //   return response.data
  // }
}
// Create new events
const createFood = async (foodData, token) => {
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.post(API_URL, foodData, config)
  
  return response.data
}
// Update events
const updateEvent = async (eventId, eventData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(API_URL + eventId, eventData, config)

  return response.data
}



const foodService = {
  createFood,
  getFoods
}

export default foodService


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