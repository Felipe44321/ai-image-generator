const express = require("express");
const fetch = require("node-fetch");
const path = require("path");
require("dotenv").config(); // ✅ Load .env variables

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ✅ Serve static files
app.use("/style", express.static(path.join(__dirname, "style")));
app.use("/script", express.static(path.join(__dirname, "script")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(express.static(path.join(__dirname)));

// ✅ API route
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

  const response = await fetch("https://api.deepai.org/api/text2img", {
  method: "POST",
  headers: {
    "Api-Key": process.env.DEEPAI_KEY,
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: new URLSearchParams({ text: prompt }),
});

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error generating image:", err);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});