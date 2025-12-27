// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  cost: {
    type: Number,
    required: true
  },
  hours_estimated: {
    type: Number,
    required: true
  },
  hours_real: {
    type: Number
  },
  image: {
    type: String
  },
  completed: {
    type: Boolean,
    default: false
  },
  finished_at: {
    type: Date
  },
  user: {
  type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

}, {
  timestamps: { createdAt: true, updatedAt: false }
});

module.exports = mongoose.model('Task', taskSchema);
