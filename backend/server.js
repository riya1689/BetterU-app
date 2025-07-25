require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

// --- 1. IMPORT YOUR NEW ROUTE FILE ---
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
  res.send("✅ Backend is live!");
});

// --- 2. USE THE AUTH ROUTES ---
// This tells the app that any URL starting with /api/auth
// should be handled by the authRoutes file.
app.use('/api/auth', authRoutes);


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
