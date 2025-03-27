const express = require('express');
const router = express.Router();
// const {updateGoal, deleteGoal } = require('../controllers/goalController');
const { getSchedaSpese, setSchedaSpese } = require('../controllers/schedaSpeseController');
const { protect } = require('../middleware/authMiddleware')


router.route('/').get(protect, getSchedaSpese).post(protect, setSchedaSpese) //shortcut
// router.route('/:id').put(protect, updateGoal).delete(protect, deleteGoal) //shortcut

// router.get('/', getGoals)
// router.post('/', setGoals)
// router.put('/:id', editGoals)
// router.delete('/:id', deleteGoals)


module.exports = router;