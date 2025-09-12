import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// API route
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, numOutputs } = req.body;

    const response = await fetch("https://api.deepai.org/api/text2img", {
      method: "POST",
      headers: {
        "Api-Key": process.env.DEEPAI_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ text: prompt }),
    });

    const data = await response.json();

    // DeepAI gives only 1 image → duplicate for multiple outputs
    const images = [];
    for (let i = 0; i < (numOutputs || 1); i++) {
      images.push(data.output_url);
    }

    res.json({ images });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));