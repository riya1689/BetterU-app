const express = require('express');
const router = express.Router();
// --- FIX: Removed the old 'chatWithAI' import. We only need the line below. ---
const { chatController, analyzeReportController } = require('../controllers/aiController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Route for text chat uses `chatController`
router.post('/chat', authMiddleware, chatController);

// NEW ROUTE for image analysis uses `analyzeReportController`
router.post('/analyze-report', authMiddleware, upload.single('reportImage'), analyzeReportController);

module.exports = router;