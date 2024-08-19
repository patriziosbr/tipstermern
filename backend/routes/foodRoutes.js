const express = require('express');
const router = express.Router();
const { getFoods, setFood, updateFood, deleteFood  } = require('../controllers/foodController');
const { protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, getFoods).post(protect, setFood) //shortcut
router.route('/:id').put(protect, updateFood).delete(protect, deleteFood) //shortcut

// // router.get('/', getGoals)
// // router.post('/', setGoals)
// // router.put('/:id', editGoals)
// // router.delete('/:id', deleteGoals)


module.exports = router;