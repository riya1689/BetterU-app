const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../config/nodemailer');

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  
  try {
    // Step 1: Check if the user exists in the database
    let user = await User.findOne({ email });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Encrypt the password immediately so we can use it in either case
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    if (user) {
      // --- SCENARIO A: User exists AND is verified ---
      if (user.isVerified) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // --- SCENARIO B: User exists but is NOT verified (Failed previous signup) ---
      // Logic: We don't throw an error. Instead, we UPDATE the existing user with new info.
      console.log("Found unverified user account. Overwriting with new data...");
      
      user.name = name;
      user.password = hashedPassword; // Update password
      user.role = role;
      user.otp = otp; // Set new OTP
      user.isVerified = false; // Ensure it stays false until they enter OTP
      
      await user.save();

    } else {
      // --- SCENARIO C: Brand New User ---
      user = new User({
        name,
        email,
        password: hashedPassword, // Save the hashed password
        role,
        otp: otp,
        isVerified: false
      });

      await user.save();
    }

    // --- Step 2: Send Email (Shared Logic for Scenario B & C) ---
    try {
      await sendVerificationEmail(user.email, otp);
      
      res.status(201).json({ 
        message: 'Verification email sent. Please check your inbox.',
        user: { email: user.email }
      });

    } catch (emailError) {
      // Safety Net: If email fails for a NEW user, we can delete them to keep DB clean.
      // If it was an existing unverified user, we just leave them (they can try again later).
      if (!user.isVerified) {
         // Optional: You can choose to delete here if you want strict cleaning
         // await User.findByIdAndDelete(user._id); 
      }
      
      console.error("Failed to send OTP email:", emailError);
      return res.status(500).json({ message: "Could not send verification email. Please try signing up again." });
    }

  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).send('Server error');
  }
};

// --- NEW FUNCTION TO VERIFY OTP ---
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP. Please try again.' });
    }

    // OTP is correct, update the user
    user.isVerified = true;
    user.otp = null; // Clear the OTP so it cannot be used again
    await user.save();

    res.status(200).json({ message: 'Email verified successfully. You can now log in.' });

  } catch (error) {
    console.error('OTP Verification Error:', error);
    res.status(500).send('Server error during OTP verification.');
  }
};
// --- END NEW FUNCTION ---


const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(401).json({ message: 'Your account is not verified. Please check your email for the OTP.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5d' }, (err, token) => {
            if (err) throw err;
            res.json({ 
              token, 
              user: { 
                id: user.id, 
                name: user.name, 
                email: user.email, 
                role: user.role
              } 
            });
        });
    } catch (error) {
        console.error('SERVER ERROR:', error.message);
        res.status(500).send('Server error');
    }
};

module.exports = {
  registerUser,
  loginUser,
  verifyOtp, // <-- Export the new function
};
