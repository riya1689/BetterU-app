const mongoose = require('mongoose');
const { Schema } = mongoose;

const expertProfileSchema = new Schema({
  // This creates a direct link to the main User model.
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // This must match the name you used in mongoose.model('User', ...)
    required: true,
    unique: true // Ensures one expert profile per user account
  },
  specialization: {
    type: String,
    required: true,
    trim: true
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  yearsOfExperience: {
    type: Number,
    required: true,
    min: 0
  },
  bio: {
    type: String,
    maxlength: 500
  },
  // You can add more fields here later
  // e.g., qualifications, clinic address, etc.
}, {
  timestamps: true
});

const expertProfile = mongoose.model('ExpertProfile', expertProfileSchema);

module.exports = ExpertProfile;
