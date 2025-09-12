import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, numOutputs } = req.body;

    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${process.env.REPLICATE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "7de2ea26c616d5bf2245ad0d3b9a5c7c8d66b8abdb2d50ec6b3003f3b5cde6a6", // Stable Diffusion XL
        input: {
          prompt: prompt,
          num_outputs: numOutputs || 1,
          width: 512,
          height: 512,
        },
      }),
    });

    const prediction = await response.json();
    res.status(200).json(prediction);
  } catch (error) {
    console.error("Backend error:", error);
    res.status(500).json({ error: error.message });
  }
}