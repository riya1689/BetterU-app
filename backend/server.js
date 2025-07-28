require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes'); // <-- 1. IMPORT YOUR NEW AI ROUTE FILE

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  res.send("✅ Backend is live!");
});

// Use the Auth Routes
app.use('/api/auth', authRoutes);

// --- 2. USE THE AI ROUTES ---
// This tells the app that any URL starting with /api/ai
// should be handled by the aiRoutes file.
app.use('/api/ai', aiRoutes);


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
