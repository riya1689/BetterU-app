const nodemailer = require('nodemailer');
require("dotenv").config();
// Create a transporter object using manual SMTP configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', 
  port: 587, 
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  }, 
  tls: {
    rejectUnauthorized: false // CRITICAL: Helps bypass Render's strict firewall
  }
});

// Function to verify connection on startup
const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log('✅ Nodemailer (Gmail) connected successfully!');
  } catch (error) {
    console.error('❌ Nodemailer (Gmail) connection failed:', error);
  }
};

// Function to send the verification email
const sendVerificationEmail = async (to, otp) => {
  const mailOptions = {
    from: `"BetterU" <${process.env.EMAIL_USER}>`, 
    to: to, 
    subject: 'Your BetterU Verification Code', 
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
    throw new Error('Could not send verification email.');
  }
};

module.exports = { 
  sendVerificationEmail, 
  verifyEmailConnection // Now this will work because the function exists above
};








// const nodemailer = require('nodemailer');
// // Create a transporter object using manual SMTP configuration
// const transporter = nodemailer.createTransport({
//   host: 'smtp.gmail.com', // Google's SMTP server
//   port: 587, // Use port 587 for TLS
//   secure: false, // false for port 587, as it will upgrade to TLS
//   auth: {
//     user: process.env.EMAIL_USER, // Your Gmail address from .env
//     pass: process.env.EMAIL_PASS, // Your App Password from .env
//   }, 
// });

// // Function to send the verification email
// const sendVerificationEmail = async (to, otp) => {
//   const mailOptions = {
//     from: `"BetterU" <${process.env.EMAIL_USER}>`, // Sender address
//     to: to, // List of receivers
//     subject: 'Your BetterU Verification Code', // Subject line
//     html: `
//       <div style="font-family: Arial, sans-serif; color: #333;">
//         <h2>Welcome to BetterU!</h2>
//         <p>Thank you for signing up. Please use the following One-Time Password (OTP) to verify your email address:</p>
//         <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; color: #1e3a8a;">${otp}</p>
//         <p>This code will expire in 10 minutes.</p>
//         <p>If you did not sign up for BetterU, please ignore this email.</p>
//       </div>
//     `,
//   };

//   // try {
//   //   await transporter.sendMail(mailOptions);
//   //   console.log('Verification email sent successfully to:', to);
//   // } catch (error) {
//   //   console.error('Error sending verification email:', error);
//   //   // We throw the error so the controller knows the email failed to send
//   //   throw new Error('Could not send verification email.');
//   // }
//   const verifyEmailConnection = async () => {
//   try {
//     await transporter.verify();
//     console.log('✅ Nodemailer (Gmail) connected successfully!');
//   } catch (error) {
//     console.error('❌ Nodemailer (Gmail) connection failed:', error);
//   }
// };
// };

// // --- UPDATE YOUR EXPORTS ---
// module.exports = { 
//   sendVerificationEmail,
//   verifyEmailConnection // <-- Export the new function
// };

// // module.exports = { sendVerificationEmail };
