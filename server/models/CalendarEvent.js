const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  post: {
    type: String,
    required: [true, 'Please add the post content'],
    trim: true
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Please specify a scheduled date']
  },
  status: {
    type: String,
    enum: ['Draft', 'Scheduled', 'Published'],
    default: 'Draft'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
