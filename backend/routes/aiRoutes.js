const express = require('express');
const router = express.Router();
const { chatWithAI } = require('../controllers/aiController');

// @route   POST api/ai/chat
// @desc    Send a message to the AI companion
// @access  Public (for now)
router.post('/chat', chatWithAI);

module.exports = router;
