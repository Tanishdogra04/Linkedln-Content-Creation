const mongoose = require('mongoose');

const analyticsLogSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['generation', 'research'],
    required: true
  },
  topic: {
    type: String,
    trim: true,
    default: ''
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

module.exports = mongoose.model('AnalyticsLog', analyticsLogSchema);
