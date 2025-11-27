const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  // Who is receiving this notification? (e.g., The Admin or The User)
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Who triggered this notification? (e.g., The Applicant)
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // What kind of notification is it?
  type: {
    type: String,
    enum: ['job_application', 'application_approved', 'application_rejected'],
    required: true
  },
  // The display text (e.g., "John Doe applied for Consultant")
  message: {
    type: String,
    required: true
  },
  // Link to the specific object (e.g., The Application ID)
  // This helps us open the specific detail screen when clicked
  relatedId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'DoctorApplication'
  },
  // To handle the "Badge Counter" (Red dot)
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);