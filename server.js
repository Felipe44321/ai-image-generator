
const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch("https://api.deepai.org/api/text2img", {
      method: "POST",
      headers: {
        "Api-Key": process.env.DEEPAI_KEY,  // Must match your Render env var name
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({ text: prompt })
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));