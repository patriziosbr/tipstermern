import axios from 'axios'

const API_URL = '/api/event/' // OK

// const API_URL = process.env.REACT_APP_NODE_ENV === 'production'
//   ? process.env.REACT_APP_SECRET_NAME
//   : '/api/event/';

// Get user events
const getEvents = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL, config)

  if(response.data.message) {
    console.log('no events in db');
  } else {
    response.data.forEach(event => {
      updateDateProperty(event, "startAt")
      updateDateProperty(event, "endAt")
      updateDateProperty(event, "createdAt")
      updateDateProperty(event, "updatedAt")
    });
    return response.data
  }
}


// Create new events
const createEvent = async (eventData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.post(API_URL, eventData, config)

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



const eventService = {
  createEvent,
  updateEvent,
  getEvents,
}

export default eventService


function updateDateProperty(obj, property) {
  if (obj[property]) {
    const tempDate = new Date(obj[property]);

    if(property === "createdAt" || property === "updatedAt") {
      obj[property] = tempDate.toLocaleDateString() + " " + tempDate.getHours() + ":" + tempDate.getMinutes() ;
    } else {
      obj[property] = tempDate.toLocaleDateString();
    }
  }
}