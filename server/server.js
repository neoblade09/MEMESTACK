const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "MEMESTACK API is alive! 🚀",
  });
});

// API status
app.get("/api/status", (req, res) => {
  res.json({
    success: true,
    app: "MEMESTACK",
    status: "running",
    version: "1.0.0",
  });
});

// Get all memes
app.get("/api/memes", (req, res) => {
  try {
    const memesPath = path.join(
      __dirname,
      "..",
      "public",
      "data",
      "memes.json"
    );

    const fileContents = fs.readFileSync(memesPath, "utf8");
    const memes = JSON.parse(fileContents);

    if (!Array.isArray(memes)) {
      return res.status(500).json({
        success: false,
        message: "Meme data must be an array.",
      });
    }

    return res.json({
      success: true,
      memes,
    });
  } catch (error) {
    console.error("Failed to load memes:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to load memes.",
    });
  }
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `🚀 MEMESTACK API running at http://localhost:${PORT}`
  );
});