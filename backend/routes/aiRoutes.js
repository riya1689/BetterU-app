const express = require('express');
const router = express.Router();
const { chatController, analyzeReportController } = require('../controllers/aiController');
// --- FIX: Corrected the folder name from 'middleware' to 'middlewares' ---
const { protect } = require('../middlewares/authMiddleware'); 
const upload = require('../middlewares/uploadMiddleware');

// --- FIX: Use the 'protect' function instead of the old 'authMiddleware' ---
// This route now checks for a valid login token before allowing access
router.post('/chat', protect, chatController);

// This route also uses 'protect' to ensure the user is logged in
router.post('/analyze-report', protect, upload.single('reportImage'), analyzeReportController);

module.exports = router;





// const express = require('express');
// const router = express.Router();
// // --- FIX: Removed the old 'chatWithAI' import. We only need the line below. ---
// const { chatController, analyzeReportController } = require('../controllers/aiController');
// const authMiddleware = require('../middlewares/authMiddleware');
// const upload = require('../middlewares/uploadMiddleware');

// // Route for text chat uses `chatController`
// router.post('/chat', authMiddleware, chatController);

// // NEW ROUTE for image analysis uses `analyzeReportController`
// router.post('/analyze-report', authMiddleware, upload.single('reportImage'), analyzeReportController);

// module.exports = router;


