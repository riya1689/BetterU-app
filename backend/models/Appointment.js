const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This creates a link to your User model
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    doctorId: {
        // You'll need to pass the doctor's ID from the frontend
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Psychologist', // Assuming you have a Psychologist model
        
    },
    doctorName: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    problemDescription: {
        type: String,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'cancelled'],
        default: 'pending'
    },
    transactionId: { // This will be the tran_id from SSLCommerz
        type: String,
        unique: true
    },
    itemId: { // This will be the uniqueId from the frontend
        type: String,
        unique: true
    }
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;