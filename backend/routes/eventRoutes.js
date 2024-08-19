const express = require('express');
const router = express.Router();
const { getEvents, setEvent, updateEvent, deleteEvent  } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware')

router.route('/').get(getEvents).post(protect, setEvent) //shortcut
// router.route('/').get(protect, getEvents).post(protect, setEvent) //shortcut ORIGIN
router.route('/:id').put(protect, updateEvent).delete(protect, deleteEvent) //shortcut

// // router.get('/', getGoals)
// // router.post('/', setGoals)
// // router.put('/:id', editGoals)
// // router.delete('/:id', deleteGoals)


module.exports = router;

//MODELLO
//FARE server.js x aggiungere base url
//FARE IL CONTROLLER
//FARE LA ROTTA questa