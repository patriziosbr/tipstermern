const express = require('express');
const router = express.Router();
const { setScheduledEvents  } = require('../controllers/scheduledEventController');
const { protect } = require('../middleware/authMiddleware')

router.route('/').post(protect, setScheduledEvents) //shortcut
// router.route('/:id').put(protect, updateEvent).delete(protect, deleteEvent) //shortcut


module.exports = router;