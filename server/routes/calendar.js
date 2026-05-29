const express = require('express');
const router = express.Router();
const { getCalendarEvents, createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } = require('../controllers/calendarController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getCalendarEvents)
  .post(createCalendarEvent);

router.route('/:id')
  .put(updateCalendarEvent)
  .delete(deleteCalendarEvent);

module.exports = router;
