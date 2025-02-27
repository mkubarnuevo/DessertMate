document.addEventListener("DOMContentLoaded", async () => { 
    const menuContainer = document.getElementById("menuContainer");

    try {
        const response = await fetch("http://localhost:5500/api/menu");
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const menuItems = await response.json();

        if (!menuItems || menuItems.length === 0) {
            menuContainer.innerHTML = "<p>No menu items available.</p>";
            return;
        }

        menuItems.forEach(item => {
            const menuCard = document.createElement("div");
            menuCard.classList.add("menu-card");

            menuCard.innerHTML = `
                <div class="menu-image">
                    <img src="${item.image || 'placeholder.jpg'}" 
                         alt="${item.name}" 
                         style="width: 150px; height: 150px; object-fit: cover; border-radius: 8px;">
                </div>
                <h3>${item.name}</h3>
                <p><strong>₱${parseFloat(item.price).toFixed(2)}</strong></p>
                <p>${item.description}</p>
            `;

            menuContainer.appendChild(menuCard);
        });
    } catch (error) {
        console.error("Error fetching menu:", error);
        menuContainer.innerHTML = "<p style='color: red;'>Failed to load menu. Please try again later.</p>";
    }
});

