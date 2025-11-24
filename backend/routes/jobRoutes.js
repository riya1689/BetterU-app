const express = require('express');
const router = express.Router();
const { getActiveJobs, applyForJob } = require('../controllers/jobController');
const {protect} = require('../middlewares/authMiddleware'); // Your existing auth check

// Note: If you have a Multer config for file uploads, import it here
 const upload = require('../middlewares/uploadMiddleware'); 

// --- Routes ---

// 1. Get all jobs (Public or Protected, depending on your choice)
router.get('/', getActiveJobs); // GET /api/jobs

// 2. Apply for a job (Requires Login)
// If using Multer: router.post('/apply', authMiddleware, upload.fields([{ name: 'cv' }, { name: 'profileImage' }]), applyForJob);
router.post('/apply', protect, applyForJob); // POST /api/jobs/apply

module.exports = router;