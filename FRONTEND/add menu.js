document.getElementById("add").addEventListener("click", async () => { 
    const name = document.getElementById("dessert_name").value.trim();
    const price = document.getElementById("price").value.trim();
    const description = document.getElementById("description").value.trim();
    const imageUpload = document.getElementById("imageUpload").files[0];

    if (!name || !price || !description || !imageUpload) {
        alert("All fields are required!");
        return;
    }

    if (isNaN(price) || parseFloat(price) <= 0) {
        alert("Please enter a valid price.");
        return;
    }

    const addButton = document.getElementById("add");
    addButton.disabled = true;
    addButton.innerText = "Adding...";

    const reader = new FileReader();
    reader.readAsDataURL(imageUpload);
    reader.onloadend = async () => {
        const image = reader.result;

        try {
            const response = await fetch("http://localhost:5500/api/menu", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, price, description, image })
            });

            const data = await response.json();
            alert(data.message);

            if (response.ok) {
                window.location.reload();
            }
        } catch (error) {
            console.error("Error adding menu item:", error);
            alert("Failed to add menu item.");
        } finally {
            addButton.disabled = false;
            addButton.innerText = "Add Dessert";
        }
    };
});
