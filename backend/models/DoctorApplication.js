const mongoose = require('mongoose');

const doctorApplicationSchema = new mongoose.Schema({
  // Link to the User who is applying
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Link to the Job they are applying for
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  
  // --- Personal & Professional Info ---
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },

  dateOfBirth: { type: String, required: true }, // e.g. 1995-05-20
  gender: { type: String, required: true },      // e.g. Male/Female
  presentAddress: { type: String, required: true },
  
  age: { type: String, required: true },

  specialization: { type: String, required: true }, // e.g., "Child Psychologist"
  medicalDegree: { type: String, required: true }, // e.g., "MBBS, FCPS"
  institute: { type: String, required: true }, // e.g., "Dhaka Medical College"
  passingYear: { type: String, required: true },
  experience: { type: String, required: true },
  
  // --- Verification Documents ---
  // We will store the URL/Path of the uploaded files here
  cvUrl: { type: String, required: true }, 
  profileImageUrl: { type: String, required: true },
  certificateUrl: { type: String }, // Optional but recommended
  socialLink: { type: String },
  
  // --- Payment / Verification Info ---
  bkashNumber: { type: String, required: true }, // For salary or verification fee
  nidNumber: { type: String }, 
  
  // --- Admin Status ---
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('DoctorApplication', doctorApplicationSchema); 