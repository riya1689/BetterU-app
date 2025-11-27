const Job = require('../models/Job');
const DoctorApplication = require('../models/DoctorApplication');
const Notification = require('../models/Notification');
const User = require('../models/user');
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
      dateOfBirth,    // NEW
      gender,         // NEW
      presentAddress, // NEW
      age,
      specialization, 
      medicalDegree, 
      institute, 
      passingYear, 
      experience,
      socialLink,
      bkashNumber, 
      nidNumber,
      //cvUrl,
      //profileImageUrl 
    } = req.body;

    let { cvUrl, profileImageUrl } = req.body;
    const applicantId = req.user.id; // Assuming you use authMiddleware that sets req.user

    if (req.files) {
      if (req.files.cv) cvUrl = req.files.cv[0].path; 
      if (req.files.profileImage) profileImageUrl = req.files.profileImage[0].path;
    }
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
    //  cvUrl = req.body.cvUrl; 
    //  profileImageUrl = req.body.profileImageUrl;

    // if (req.files) {
    //   if (req.files.cv) cvUrl = req.files.cv[0].path; 
    //   if (req.files.profileImage) profileImageUrl = req.files.profileImage[0].path;
    // }

    // Validation
    if (!cvUrl || !profileImageUrl) {
      return res.status(400).json({ message: "CV and Profile Image are required." });
    }

    if (!age) {
        return res.status(400).json({ message: "Age is required." });
    }
    // C. Create the Application
    const newApplication = new DoctorApplication({
      applicantId,
      jobId,
      fullName,
      email,
      phone,
      dateOfBirth,    // Save
      gender,         // Save
      presentAddress, // Save
      age,
      specialization,
      medicalDegree,
      institute,
      passingYear,
      experience,
      socialLink,
      bkashNumber,
      nidNumber,
      cvUrl,
      profileImageUrl,
      status: 'pending'
    });

    await newApplication.save();

    // --- SEND NOTIFICATION TO ADMIN ---
    try {
        // 1. Find the Job Title (for the message)
        const jobInfo = await Job.findById(jobId);
        const jobTitle = jobInfo ? jobInfo.title : 'a position';

        // 2. Find the Admin User(s)
        // We assume there is a user with role: 'admin'
        const adminUser = await User.findOne({ role: 'admin' });

        if (adminUser) {
            await Notification.create({
                recipient: adminUser._id, // Send to Admin
                sender: applicantId,      // From Applicant
                type: 'job_application',
                message: `${fullName} has applied for ${jobTitle}.`,
                relatedId: newApplication._id
            });
            console.log("Notification sent to Admin:", adminUser.email);
        } else {
            console.log("No Admin found to receive notification.");
        }
    } catch (notifyError) {
        // Don't stop the application process if notification fails, just log it
        console.error("Notification Error:", notifyError);
    }

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