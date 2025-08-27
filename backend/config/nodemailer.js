const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use the Gmail service
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address from .env
    pass: process.env.EMAIL_PASS, // Your App Password from .env
  },
});

// Function to send the verification email
const sendVerificationEmail = async (to, otp) => {
  const mailOptions = {
    from: `"BetterU" <${process.env.EMAIL_USER}>`, // Sender address
    to: to, // List of receivers
    subject: 'Your BetterU Verification Code', // Subject line
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>Welcome to BetterU!</h2>
        <p>Thank you for signing up. Please use the following One-Time Password (OTP) to verify your email address:</p>
        <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #1e3a8a;">${otp}</p>
        <p>This code will expire in 10 minutes.</p>
        <p>If you did not sign up for BetterU, please ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully to:', to);
  } catch (error) {
    console.error('Error sending verification email:', error);
    // We throw the error so the controller knows the email failed to send
    throw new Error('Could not send verification email.');
  }
};

module.exports = { sendVerificationEmail };
