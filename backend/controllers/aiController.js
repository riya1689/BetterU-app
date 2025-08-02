// backend/controllers/aiController.js

// --- UPDATE: Import both functions from the service ---
const { getAIResponse, analyzeImageWithAI } = require('../services/geminiService');

// This controller remains the same
const chatController = async (req, res) => {
    try {
        const { userMessage, history } = req.body;
        if (!userMessage) {
            return res.status(400).json({ error: 'userMessage is required' });
        }
        const reply = await getAIResponse(userMessage, history || []);
        res.json({ reply });
    } catch (error) {
        console.error('Error in chatController:', error);
        res.status(500).json({ error: 'Failed to get AI response' });
    }
};

// --- UPDATE: This controller now calls the AI for analysis ---
const analyzeReportController = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No report image was uploaded.' });
        }
        
        // Call the new service function with the uploaded file
        const reply = await analyzeImageWithAI(req.file);

        // Send the AI's analysis back to the frontend
        res.json({ reply });

    } catch (error) {
        console.error('Error in analyzeReportController:', error);
        res.status(500).json({ error: 'Failed to process image.' });
    }
};

module.exports = {
    chatController,
    analyzeReportController
};