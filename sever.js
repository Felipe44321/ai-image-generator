import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    // Example using DeepAI free API (replace with your key if needed)
    const response = await fetch("https://api.deepai.org/api/text2img", {
      method: "POST",
      headers: {
        "Api-Key": process.env.DEEPAI_KEY, // set this in Render Dashboard
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ text: prompt }),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));