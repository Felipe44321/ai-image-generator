const form = document.querySelector("#prompt-form");
const promptInput = document.querySelector("#prompt-input");
const imgQuantity = document.querySelector("#img-quantity");
const gallery = document.querySelector("#gallery");

function updateImageCard(urls) {
  gallery.innerHTML = "";
  urls.forEach((url, index) => {
    const imgCard = document.createElement("div");
    imgCard.classList.add("img-card");

    const img = document.createElement("img");
    img.src = url;

    const downloadBtn = document.createElement("a");
    downloadBtn.href = url;
    downloadBtn.download = `ai-image-${index + 1}.jpg`;
    downloadBtn.textContent = "Download";
    downloadBtn.classList.add("download-btn");

    imgCard.appendChild(img);
    imgCard.appendChild(downloadBtn);
    gallery.appendChild(imgCard);
  });
}

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

    updateImageCard(urls);
  } catch (err) {
    alert(err.message);
  }
}

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const prompt = promptInput.value.trim();
    const quantity = parseInt(imgQuantity.value, 10);
    if (prompt) generateAIImages(prompt, quantity);
  });
}