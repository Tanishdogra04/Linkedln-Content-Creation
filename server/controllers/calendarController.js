const CalendarEvent = require('../models/CalendarEvent');

// @desc    Get all calendar events
// @route   GET /api/calendar
// @access  Private
const getCalendarEvents = async (req, res) => {
  try {
    const events = await CalendarEvent.find({ user: req.user.id }).sort({ scheduledDate: 1 });
    res.json({ success: true, count: events.length, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create calendar event
// @route   POST /api/calendar
// @access  Private
const createCalendarEvent = async (req, res) => {
  const { title, post, scheduledDate, status } = req.body;

  if (!title || !post || !scheduledDate) {
    return res.status(400).json({ success: false, message: 'Please add all required fields' });
  }

  try {
    const event = await CalendarEvent.create({
      title,
      post,
      scheduledDate,
      status: status || 'Draft',
      user: req.user.id
    });

    res.status(201).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update calendar event
// @route   PUT /api/calendar/:id
// @access  Private
const updateCalendarEvent = async (req, res) => {
  try {
    let event = await CalendarEvent.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Calendar event not found' });
    }

    // Verify ownership
    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to edit this schedule' });
    }

    event = await CalendarEvent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete calendar event
// @route   DELETE /api/calendar/:id
// @access  Private
const deleteCalendarEvent = async (req, res) => {
  try {
    const event = await CalendarEvent.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Calendar event not found' });
    }

    // Verify ownership
    if (event.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this schedule' });
    }

    await event.deleteOne();

    res.json({ success: true, message: 'Calendar event removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent
};
