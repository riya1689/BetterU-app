const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // e.g., "Consultant Psychiatrist"
  },
  designation: {
    type: String,
    required: true, // e.g., "Senior Consultant"
  },
  requirements: {
    type: [String], // Array of strings for bullet points
    required: true
  },
  description: {
    type: String,
    required: true
  },
  salaryRange: {
    type: String, // e.g., "50k - 80k" or "Negotiable"
  },
  deadline: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true // Admin can toggle this to false to hide the job
  }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);