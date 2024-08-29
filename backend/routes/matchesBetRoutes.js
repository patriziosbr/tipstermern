const express = require('express');
const router = express.Router();
const { getMatchesBet, setMatchesBet, deleteMatchesBet} = require('../controllers/matchesBetController');
const { protect } = require('../middleware/authMiddleware')


router.route('/').get(protect, getMatchesBet).post(protect, setMatchesBet) //shortcut ORIGIN
router.route('/:id').delete(protect, deleteMatchesBet) //shortcut
// router.route('/:id').put(protect, updateEvent).delete(protect, deleteMatchesBet) //shortcut

// // router.get('/', getGoals)
// // router.post('/', setGoals)
// // router.put('/:id', editGoals)
// // router.delete('/:id', deleteGoals)


module.exports = router;

//MODELLO
//FARE server.js x aggiungere base url
//FARE IL CONTROLLER
//FARE LA ROTTA questa