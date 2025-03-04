document.addEventListener("DOMContentLoaded", async () => { 
    const menuContainer = document.querySelector(".menu-catalog");

    try {
        // Fetch menu data from the backend
        const response = await fetch("http://localhost:5500/api/menu");

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const menuItems = await response.json();

        // If no menu items are found, display a message
        if (!menuItems || menuItems.length === 0) {
            menuContainer.innerHTML = "<p>No menu items available.</p>";
            return;
        }

        // Clear existing content
        menuContainer.innerHTML = "";

        // Loop through menu items and create UI elements
        menuItems.forEach(item => {
            const menuItem = document.createElement("div");
            menuItem.classList.add("menu-item");

            menuItem.innerHTML = `
                <div class="image-placeholder">
                    <img src="${item.image}" alt="${item.name}" id="image-${item._id}" 
                         style="width: 250px; height: 200px; object-fit: cover; border-radius: 8px;">
                </div>
                <div class="details">
                    <input type="text" id="name-${item._id}" value="${item.name}" disabled>
                    <input type="number" id="price-${item._id}" value="${item.price}" disabled>
                    <textarea id="description-${item._id}" disabled>${item.description}</textarea>
                </div>
                <div class="actions">
                    <button class="edit-menu" onclick="toggleEditMode('${item._id}')">Edit</button>
                    <button class="save-menu" onclick="saveMenuItem('${item._id}')" style="display: none;">Save</button>
                    <button class="delete-menu" onclick="deleteMenuItem('${item._id}')">Delete</button>
                </div>
            `;

            menuContainer.appendChild(menuItem);
        });
    } catch (error) {
        console.error("Error fetching menu:", error);
        menuContainer.innerHTML = "<p style='color: red;'>Failed to load menu. Please try again later.</p>";
    }
});

// Function to enable editing mode
function toggleEditMode(id) {
    document.getElementById(`name-${id}`).disabled = false;
    document.getElementById(`price-${id}`).disabled = false;
    document.getElementById(`description-${id}`).disabled = false;

    document.querySelector(`.edit-menu[onclick="toggleEditMode('${id}')"]`).style.display = "none";
    document.querySelector(`.save-menu[onclick="saveMenuItem('${id}')"]`).style.display = "inline-block";
}

// Function to save updated menu item
async function saveMenuItem(id) {
    const name = document.getElementById(`name-${id}`).value.trim();
    const price = document.getElementById(`price-${id}`).value.trim();
    const description = document.getElementById(`description-${id}`).value.trim();

    if (!name || !price || !description) {
        alert("All fields are required.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5500/api/menu/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, price, description })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to update menu item.");
        }

        alert("Menu item updated successfully.");
        window.location.reload();
    } catch (error) {
        console.error("Error updating menu item:", error);
        alert("Failed to update menu item.");
    }
}

// Function to delete a menu item
async function deleteMenuItem(id) {
    if (confirm("Are you sure you want to delete this item?")) {
        try {
            const response = await fetch(`http://localhost:5500/api/menu/${id}`, { method: "DELETE" });

            if (!response.ok) {
                throw new Error("Failed to delete menu item.");
            }

            alert("Menu item deleted successfully.");
            window.location.reload();
        } catch (error) {
            console.error("Error deleting menu item:", error);
            alert("Failed to delete menu item.");
        }
    }
}

