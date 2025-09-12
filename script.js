const generateForm = document.querySelector(".generate-form");
const imageGallery = document.querySelector(".image-gallery");

// Update cards with images
const updateImageCard = (imgUrls) => {
  imgUrls.forEach((url, index) => {
    const imgCard = imageGallery.querySelectorAll(".img-card")[index];
    const imgElement = imgCard.querySelector("img");

    imgElement.src = url;

    imgElement.onload = () => {
      imgCard.classList.remove("loading");
    };

    const downloadBtn = imgCard.querySelector(".download-btn");
    downloadBtn.setAttribute("href", url);
    downloadBtn.setAttribute("download", `ai-image-${index + 1}.jpg`);
  });
};

// Call your backend
const generateAiImages = async (userPrompt, userImgQuantity) => {
  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: userPrompt, numOutputs: userImgQuantity }),
    });

    if (!response.ok) throw new Error("Failed to fetch from backend");

    const prediction = await response.json();

    if (prediction.error) throw new Error(prediction.error);

    // DeepAI returns only 1 image per call → adapt
    const imageUrls = prediction.output_url ? [prediction.output_url] : [];

    if (imageUrls.length === 0) {
      throw new Error("No images generated. Try another prompt.");
    }

    updateImageCard(imageUrls);
  } catch (error) {
    alert(error.message);
    console.error("Frontend error:", error);
  }
};

// Handle form submission
const handleFormSubmission = (e) => {
  e.preventDefault();

  const userPrompt = e.target[0].value.trim();
  const userImgQuantity = e.target[1].value;

  if (!userPrompt) {
    alert("Please enter a description for your image.");
    return;
  }

  // Show placeholders while loading
  const imgCardMarkup = Array.from({ length: userImgQuantity }, () =>
    `<div class="img-card loading">
      <img src="images/loader.svg" alt="loading...">
      <a href="#" class="download-btn">
        <img src="images/download.svg" alt="download icon">
      </a>
    </div>`
  ).join("");

  imageGallery.innerHTML = imgCardMarkup;

  // Call backend
  generateAiImages(userPrompt, userImgQuantity);
};

generateForm.addEventListener("submit", handleFormSubmission);