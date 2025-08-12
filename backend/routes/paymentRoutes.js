const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// This is the first route your app calls
router.post('/initiate', paymentController.initiatePayment);

// ✅ CORRECT: These are the callback routes SSLCommerz will call using POST
router.post('/success', paymentController.handleSuccess);
router.post('/fail', paymentController.handleFail);
router.post('/cancel', paymentController.handleCancel);
router.post('/ipn', paymentController.handleIPN); // For IPN notifications

module.exports = router;