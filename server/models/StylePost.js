const mongoose = require('mongoose');

const stylePostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title for the style example'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Please add post content'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please add a category (e.g., Tech, Storytelling, Marketing)'],
    trim: true
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

module.exports = mongoose.model('StylePost', stylePostSchema);
