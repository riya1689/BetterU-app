const Job = require('../models/Job');
const DoctorApplication = require('../models/DoctorApplication');

// --- 1. Get All Active Jobs (User Side) ---
const getActiveJobs = async (req, res) => {
  try {
    // Only fetch jobs that are marked as Active
    const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error("Get Jobs Error:", error);
    res.status(500).json({ message: "Failed to fetch job openings." });
  }
};

// --- 2. Apply for a Job ---
const applyForJob = async (req, res) => {
  try {
    const { 
      jobId, 
      fullName, 
      email, 
      phone, 
      specialization, 
      medicalDegree, 
      institute, 
      passingYear, 
      bkashNumber, 
      nidNumber 
    } = req.body;

    const applicantId = req.user.id; // Assuming you use authMiddleware that sets req.user

    // A. Check if user already applied for THIS job
    const existingApplication = await DoctorApplication.findOne({ 
      applicantId, 
      jobId 
    });

    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this position." });
    }

    // B. Handle File Uploads (Expects 'cv' and 'profileImage' fields from Multer)
    // If you haven't set up Cloudinary yet, this will store local paths or URLs sent from frontend
    let cvUrl = req.body.cvUrl; 
    let profileImageUrl = req.body.profileImageUrl;

    if (req.files) {
      if (req.files.cv) cvUrl = req.files.cv[0].path; 
      if (req.files.profileImage) profileImageUrl = req.files.profileImage[0].path;
    }

    // Validation
    if (!cvUrl || !profileImageUrl) {
      return res.status(400).json({ message: "CV and Profile Image are required." });
    }

    // C. Create the Application
    const newApplication = new DoctorApplication({
      applicantId,
      jobId,
      fullName,
      email,
      phone,
      specialization,
      medicalDegree,
      institute,
      passingYear,
      bkashNumber,
      nidNumber,
      cvUrl,
      profileImageUrl,
      status: 'pending'
    });

    await newApplication.save();

    res.status(201).json({ message: "Application submitted successfully! Please wait for admin approval." });

  } catch (error) {
    console.error("Apply Job Error:", error);
    res.status(500).json({ message: "Failed to submit application." });
  }
};

module.exports = {
  getActiveJobs,
  applyForJob
};