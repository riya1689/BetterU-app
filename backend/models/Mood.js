const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: String, 
    required: true // e.g., 'Happy', 'Sad', 'Anxious', 'Neutral', 'Angry'
  },
  score: {
    type: Number,
    required: true // e.g., 5 (Happy) to 1 (Sad/Angry) - used for Graph calculation
  },
  timeOfDay: {
    type: String,
    enum: ['Morning', 'Afternoon', 'Evening'],
    required: true
  },
  note: {
    type: String, 
    default: ''
  },
  date: {
    type: Date,
    default: Date.now 
  }
}, { timestamps: true });

module.exports = mongoose.model('Mood', moodSchema);