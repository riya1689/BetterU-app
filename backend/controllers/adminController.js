const User = require('../models/user');
const Job = require('../models/Job');
const DoctorApplication = require('../models/DoctorApplication');
const ExpertProfile = require('../models/ExpertProfile');
const Notification = require('../models/Notification');
// @desc    Get all users with the 'user' role
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all users with the 'doctor' role
// @route   GET /api/admin/doctors
// @access  Private/Admin
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('-password');
    res.json(doctors);
  } catch (error) { // --- FIX: Added the missing opening curly brace ---
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a user by ID
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.deleteOne();
      res.json({ message: 'User removed successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

// --- 1. Create a New Job Circular (Admin) ---
const createJob = async (req, res) => {
  try {
    const { title, designation, requirements, description, salaryRange, deadline } = req.body;

    // Validate required fields
    if (!title || !designation || !description || !deadline) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    const newJob = new Job({
      title,
      designation,
      requirements, // Expecting an array of strings ["MBBS", "3 Years Exp"]
      description,
      salaryRange,
      deadline
    });

    await newJob.save();
    res.status(201).json({ message: "Job circular posted successfully!", job: newJob });

  } catch (error) {
    console.error("Create Job Error:", error);
    res.status(500).json({ message: "Failed to post job." });
  }
};

//------------- Delete Job -----------
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (job) {
      await job.deleteOne();
      res.json({ message: 'Job circular removed successfully' });
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    console.error("Delete Job Error:", error);
    res.status(500).send('Server Error');
  }
};


// --- 2. Get All Pending Applications (Admin Dashboard) ---
const getAllApplications = async (req, res) => {
  try {
    // Fetch all applications and populate the user's name/email just in case
    const applications = await DoctorApplication.find()
      .populate('applicantId', 'name email') 
      .populate('jobId', 'title designation')
      .sort({ createdAt: -1 }); // Newest first

    res.json(applications);
  } catch (error) {
    console.error("Fetch Applications Error:", error);
    res.status(500).json({ message: "Failed to fetch applications." });
  }
};

// --- 3. Approve Doctor Application (THE MAIN LOGIC) ---
const approveDoctorApplication = async (req, res) => {
  const { applicationId } = req.params;

  try {
    // A. Find the Application
    const application = await DoctorApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    if (application.status === 'approved') {
      return res.status(400).json({ message: "This application is already approved." });
    }

    // B. Find the User associated with this application
    const user = await User.findById(application.applicantId);
    if (!user) {
      return res.status(404).json({ message: "Applicant user account not found." });
    }

    // C. Check if they are already a doctor
    const existingProfile = await ExpertProfile.findOne({ user: user._id });
    if (existingProfile) {
      return res.status(400).json({ message: "User is already registered as a doctor." });
    }

    // D. Calculate Years of Experience (Current Year - Passing Year)
    const currentYear = new Date().getFullYear();
    const passingYear = parseInt(application.passingYear) || currentYear;
    const calculatedExperience = Math.max(0, currentYear - passingYear);

    // E. Create the Expert Profile
    const newExpertProfile = new ExpertProfile({
      user: user._id,
      specialization: application.specialization,
      // Mapping NID to License temporarily if License wasn't in the form
      licenseNumber: application.nidNumber || `TEMP-${Date.now()}`, 
      yearsOfExperience: calculatedExperience,
      bio: `Dr. ${application.fullName} is a specialist in ${application.specialization} with ${calculatedExperience} years of experience.`,
    });

    await newExpertProfile.save();

    // F. Update User Role to 'doctor'
    user.role = 'doctor';
    await user.save();

    // G. Update Application Status
    application.status = 'approved';
    await application.save();

    // --- H. SEND NOTIFICATION TO USER ---
    await Notification.create({
        recipient: user._id, // The Applicant
        sender: req.user.id, // The Admin (who approved it)
        type: 'application_approved',
        message: "Application Approved. Please log in as a Doctor.",
        relatedId: application._id
    });

    res.json({ 
      message: "Doctor approved successfully! User role updated.", 
      user: { name: user.name, role: user.role } 
    });

  } catch (error) {
    console.error("Approve Doctor Error:", error);
    res.status(500).json({ message: "Failed to approve doctor." });
  }
};

// --- 4. Reject Application ---
const rejectDoctorApplication = async (req, res) => {
  const { applicationId } = req.params;
  try {
    const application = await DoctorApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found." });
    }

    application.status = 'rejected';
    await application.save();

    // --- SEND NOTIFICATION TO USER ---
    await Notification.create({
        recipient: application.applicantId, // The Applicant
        sender: req.user.id, // The Admin
        type: 'application_rejected',
        message: "Your application was not successful at this time.",
        relatedId: application._id
    });
    // ------------------------------------

    res.json({ message: "Application rejected." });

  } catch (error) {
    console.error("Reject Error:", error);
    res.status(500).json({ message: "Failed to reject application." });
  }
};

module.exports = {
  getAllUsers,
  getAllDoctors,
  deleteUser,
  createJob,
  deleteJob,
  getAllApplications,
  approveDoctorApplication,
  rejectDoctorApplication,
};
