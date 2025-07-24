require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors"); // <--- 1. ADD THIS LINE

const app = express();
const PORT = process.env.PORT || 5000;

// --- 2. ADD THESE TWO LINES ---
app.use(cors()); // This allows my Vercel frontend to make requests
app.use(express.json());
// ------------------------------

// Connect to MongoDB
connectDB();

// (Later: add your routes here)
app.get("/", (req, res) => {
  res.send("✅ Backend is live!");
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
