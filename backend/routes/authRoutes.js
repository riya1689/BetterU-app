const express = require('express');
const router = express.Router();

// --- UPDATED: Import the new 'verifyOtp' function ---
const { registerUser, loginUser, verifyOtp } = require('../controllers/authController');

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginUser);

// --- NEW ROUTE ---
// @route   POST api/auth/verify-otp
// @desc    Verify user's email with OTP
// @access  Public
router.post('/verify-otp', verifyOtp);


module.exports = router;
