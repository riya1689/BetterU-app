const { getAIResponse } = require('../services/geminiService');

// @desc    Handle a chat message from the user
// @route   POST /api/ai/chat
// @access  Public (for now, will be protected later)
const chatWithAI = async (req, res) => {
  const { userMessage, history } = req.body;

  // Basic validation
  if (!userMessage || !Array.isArray(history)) {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  try {
    // Get the AI's response from our Gemini service
    const aiResponse = await getAIResponse(userMessage, history);

    // Send the response back to the frontend
    res.json({ reply: aiResponse });

  } catch (error) {
    console.error('Error in AI chat controller:', error);
    res.status(500).send('Server error');
  }
};

module.exports = {
  chatWithAI,
};
