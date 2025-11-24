const express = require('express');
const router = express.Router();
const { getAllUsers, 
        getAllDoctors, 
        deleteUser,
        createJob,
        deleteJob, 
        getAllApplications, 
        approveDoctorApplication, 
        rejectDoctorApplication  
    } = require('../controllers/adminController');
// --- FIX: Corrected the folder name from 'middleware' to 'middlewares' ---
const { protect, admin } = require('../middlewares/authMiddleware');

// Route to get all users
// This route is protected, and only admins can access it
router.route('/users').get(protect, admin, getAllUsers);

// Route to get all doctors
// This route is also protected for admins only
router.route('/doctors').get(protect, admin, getAllDoctors);

// Delete a user by ID
router.route('/users/:id').delete(protect, admin, deleteUser);

// --- Post Jobs ---
router.post('/jobs', createJob); // POST /api/admin/jobs

// ------ Delete Jobs -------
router.delete('/jobs/:id', deleteJob);
// --- Applications ---
router.get('/applications', getAllApplications); // GET /api/admin/applications

// --- Approval Logic ---
// PUT /api/admin/applications/:id/approve
router.put('/applications/:applicationId/approve', approveDoctorApplication); 

// PUT /api/admin/applications/:id/reject
router.put('/applications/:applicationId/reject', rejectDoctorApplication);

module.exports = router;




// const express = require('express');
// const router = express.Router();
// // --- Import the new deleteUser function ---
// const { getAllUsers, getAllDoctors, deleteUser } = require('../controllers/adminController');
// const { protect, admin } = require('../middleware/authMiddleware');

// // Get all users
// router.route('/users').get(protect, admin, getAllUsers);

// // Get all doctors
// router.route('/doctors').get(protect, admin, getAllDoctors);

// // --- ADD THIS NEW ROUTE ---
// // Delete a user by ID
// router.route('/users/:id').delete(protect, admin, deleteUser);


// module.exports = router;
