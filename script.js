// script.js

// Function to update image cards with the generated images
function updateImageCard(imgUrls) {
  const imgContainer = document.querySelector(".image-container");
  imgContainer.innerHTML = ""; // Clear old images

  imgUrls.forEach((url, index) => {
    // Create card
    const imgCard = document.createElement("div");
    imgCard.classList.add("img-card");

    // Create image
    const imgElement = document.createElement("img");
    imgElement.src = url;
    imgElement.alt = `AI Image ${index + 1}`;

    // Create download button
    const downloadBtn = document.createElement("a");
    downloadBtn.classList.add("download-btn");
    downloadBtn.href = url;
    downloadBtn.setAttribute("download", `ai-image-${index + 1}.jpg`);
    downloadBtn.innerText = "Download";

    imgCard.appendChild(imgElement);
    imgCard.appendChild(downloadBtn);
    imgContainer.appendChild(imgCard);
  });
}

// Call your backend to generate images
async function generateAIImages(userPrompt, userImgQuantity) {
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: userPrompt,
        numOutputs: userImgQuantity
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch from backend");
    }

    const prediction = await response.json();

    if (prediction.error) {
      throw new Error(prediction.error);
    }

    // DeepAI usually returns only one image, so adjust
    const imageUrls = prediction.output_url
      ? [prediction.output_url]
      : [];

    if (imageUrls.length === 0) {
      throw new Error("No images generated. Try another prompt.");
    }

    updateImageCard(imageUrls);
  } catch (error) {
    console.error("Frontend error:", error);
    alert(error.message || "Something went wrong. Please try again.");
  }
}

// Hook up Generate button
document.getElementById("generateBtn").addEventListener("click", () => {
  const userPrompt = document.getElementById("userPrompt").value;
  const userImgQuantity = document.getElementById("imgQuantity").value || 1;

  if (!userPrompt) {
    alert("Please enter a prompt.");
    return;
  }

  generateAIImages(userPrompt, userImgQuantity);
});