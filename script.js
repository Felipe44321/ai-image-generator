const form = document.querySelector(".generate-form");
const promptInput = document.querySelector(".prompt-input");
const imgQuantity = document.querySelector(".img-quantity");
const gallery = document.querySelector(".image-gallery");

function updateImageCard(imgUrls) {
  gallery.innerHTML = "";
  imgUrls.forEach((url, index) => {
    const card = document.createElement("div");
    card.classList.add("img-card");

    const img = document.createElement("img");
    img.src = url;
    img.alt = `AI Image ${index + 1}`;

    const download = document.createElement("a");
    download.href = url;
    download.download = `ai-image-${index + 1}.jpg`;
    download.classList.add("download-btn");
    download.innerHTML = `<img src="images/download.svg" alt="download">`;

    card.appendChild(img);
    card.appendChild(download);
    gallery.appendChild(card);
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
    const urls = data.images || (data.output_url ? [data.output_url] : []);
    if (urls.length === 0) throw new Error("No images generated");
    updateImageCard(urls);
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