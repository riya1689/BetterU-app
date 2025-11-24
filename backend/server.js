// server.js
const {verifyGeminiConnection} = require('./services/geminiService');
require("dotenv").config();
const express = require("express");
const paymentRoutes = require('./routes/paymentRoutes');
const connectDB = require("./config/db");
const cors = require("cors");
const { checkConnection } = require('./services/payment/sslcommerzService');
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const adminRoutes = require('./routes/adminRoutes');
const jobRoutes = require('./routes/jobRoutes');

const { verifyEmailConnection } = require('./config/nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORRECT: Apply middleware BEFORE defining routes
app.use(cors()); // This should be one of the first
app.use(express.json()); // To parse JSON request bodies


// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
    res.send("✅ Backend is live!");
});

// Now, define your routes
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/jobs',jobRoutes);

app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    await verifyGeminiConnection();
    await verifyEmailConnection();
    const connectionStatus = await checkConnection();
    console.log(connectionStatus.message);
    if (!connectionStatus.connected) {
        console.warn('⚠️ Server may not function correctly without a payment gateway connection.');
    }
});