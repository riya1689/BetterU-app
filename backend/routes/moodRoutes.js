// backend/routes/moodRoutes.js
const express = require('express');
const router = express.Router();
const { addMood, getMoodHistory } = require('../controllers/moodController');
const { protect } = require('../middlewares/authMiddleware'); // Assuming you have this from your User Auth

router.post('/', protect, addMood);
router.get('/history', protect, getMoodHistory);

module.exports = router;