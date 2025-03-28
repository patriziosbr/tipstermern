const express = require('express');
const router = express.Router();

const { getSchedaSpese, setSchedaSpese, updateSchedaSpese } = require('../controllers/schedaSpeseController');
const { protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, getSchedaSpese).post(protect, setSchedaSpese) //shortcut
router.route('/:id').put(protect, updateSchedaSpese) //update

module.exports = router;