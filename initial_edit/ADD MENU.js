document.getElementById("add").addEventListener("click", async function () {
    const name = document.getElementById("dessert_name").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;
    const imageInput = document.getElementById("image"); 

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
        const response = await fetch("http://localhost:5000/api/products", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Failed to add product");
        }

        const result = await response.json();
        console.log("Product added:", result);
        alert("Product added successfully!\nImage URL: http://localhost:5000" + result.image);

    } catch (error) {
        console.error("Error:", error);
        alert("Error adding product");
    }
});
