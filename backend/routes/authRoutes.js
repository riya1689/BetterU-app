const express = require('express');
const router = express.Router();

// --- FIX: Import both registerUser AND loginUser ---
const { registerUser, loginUser } = require('../controllers/authController');

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginUser); // This line will now work correctly

module.exports = router;
