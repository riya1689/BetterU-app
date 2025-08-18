const express = require('express');
const router = express.Router();
// --- Import the new deleteUser function ---
const { getAllUsers, getAllDoctors, deleteUser } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all users
router.route('/users').get(protect, admin, getAllUsers);

// Get all doctors
router.route('/doctors').get(protect, admin, getAllDoctors);

// --- ADD THIS NEW ROUTE ---
// Delete a user by ID
router.route('/users/:id').delete(protect, admin, deleteUser);


module.exports = router;
