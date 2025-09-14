const form = document.getElementById("image-form");
const promptInput = document.getElementById("user-prompt");
const imgQuantity = document.getElementById("img-quantity");
const gallery = document.getElementById("gallery");

async function generateAIImages(prompt, quantity) {
  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, numOutputs: quantity }),
    });

    if (!res.ok) throw new Error("Backend error");

    const data = await res.json();
    const urls = data.output_url ? [data.output_url] : data.images || [];

    if (urls.length === 0) throw new Error("No images generated");

    gallery.innerHTML = ""; // Clear old images
    urls.forEach((url) => {
      const img = document.createElement("img");
      img.src = url;
      img.alt = prompt;
      img.className = "result-img";
      gallery.appendChild(img);
    });
  } catch (err) {
    alert(err.message);
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const prompt = promptInput.value.trim();
  const quantity = parseInt(imgQuantity.value, 10);
  if (prompt) generateAIImages(prompt, quantity);
});