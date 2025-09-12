const form = document.getElementById("image-form");
const promptInput = document.getElementById("user-prompt");
const imgQuantity = document.getElementById("image-quantity");
const imgContainer = document.getElementById("image-container");

function updateImageCard(imgUrls) {
  imgContainer.innerHTML = "";
  imgUrls.forEach((url, index) => {
    const imgCard = document.createElement("div");
    imgCard.classList.add("img-card");

    const imgElement = document.createElement("img");
    imgElement.src = url;
    imgElement.alt = `AI Image ${index + 1}`;

    const downloadBtn = document.createElement("a");
    downloadBtn.href = url;
    downloadBtn.download = `ai-image-${index + 1}.jpg`;
    downloadBtn.classList.add("download-btn");
    downloadBtn.textContent = "Download";

    imgCard.appendChild(imgElement);
    imgCard.appendChild(downloadBtn);
    imgContainer.appendChild(imgCard);
  });
}

async function generateAIImages(prompt, quantity) {
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, numOutputs: quantity })
    });

    if (!response.ok) throw new Error("Backend error");

    const data = await response.json();
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