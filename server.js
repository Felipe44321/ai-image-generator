const form = document.getElementById("image-form");
const gallery = document.getElementById("gallery");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const prompt = document.getElementById("user-prompt").value;
    const quantity = document.getElementById("img-quantity").value;

    try {
        const res = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt, quantity })
        });

        const data = await res.json();
        gallery.innerHTML = ""; // Clear old results

        if (data.output_url) {
            const img = document.createElement("img");
            img.src = data.output_url;
            img.alt = prompt;
            gallery.appendChild(img);
        } else {
            gallery.innerHTML = <p style="color:red">Error: ${data.error || "No image generated"}</p>;
        }
    } catch (err) {
        console.error(err);
        gallery.innerHTML = <p style="color:red">Request failed</p>;
    }
});