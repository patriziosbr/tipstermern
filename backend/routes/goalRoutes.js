const express = require('express');
const router = express.Router();
const { getGoals, setGoals, updateGoal, deleteGoal } = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware')


router.route('/').get(protect, getGoals).post(protect, setGoals) //shortcut
router.route('/:id').put(protect, updateGoal).delete(protect, deleteGoal) //shortcut

// router.get('/', getGoals)
// router.post('/', setGoals)
// router.put('/:id', editGoals)
// router.delete('/:id', deleteGoals)


module.exports = router;