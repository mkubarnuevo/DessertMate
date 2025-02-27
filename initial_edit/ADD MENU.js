document.getElementById("image").addEventListener("change", function (event) {
    const file = event.target.files[0]; // Get selected file
    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const preview = document.getElementById("preview");
            preview.src = e.target.result; 
            preview.style.display = "block"; 
        };

        reader.readAsDataURL(file); 
    }
});

// Adding Product
document.getElementById("add").addEventListener("click", async function () {
    const name = document.getElementById("dessert_name").value;
    const description = document.getElementById("description").value;
    const imageInput = document.getElementById("image");
    const price = parseFloat(document.getElementById("price").value);

    if (isNaN(price)) {
        alert("Please enter a valid number for the price");
        return;
    }

    if (!imageInput.files.length) {
        alert("Please select an image");
        return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("image", imageInput.files[0]);

    try {
        const response = await fetch("http://localhost:5500/api/products", {
            method: "POST",
            body: formData,
            headers: {
                "Accept": "application/json"
            },
        });

        if (!response.ok) {
            throw new Error("Failed to add product");
        }

        const result = await response.json();
        console.log("Product added:", result);
        alert("Product added successfully!\nImage URL: " + result.image);

        
        const uploadedPreview = document.getElementById("preview");
        uploadedPreview.src = result.image; 
        uploadedPreview.style.display = "block"; 

    } catch (error) {
        console.error("Error:", error);
        alert("Error adding product " + error.message);
    }
});
