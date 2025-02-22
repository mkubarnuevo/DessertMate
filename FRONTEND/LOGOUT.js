document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.querySelector(".logout");

    if (!logoutButton) {
        console.error("Logout button not found!");
        return;
    }

    logoutButton.addEventListener("click", async () => {
        console.log("Logout button clicked!");

        try {
            const response = await fetch("http://localhost:5500/logout", { method: "POST" });
            const data = await response.json();

            console.log("Server response:", data);

            if (response.ok) {
                alert("Logged out successfully!");
                localStorage.removeItem("user");
                window.location.href = "LOGIN PAGE.html";
            } else {
                alert("Logout failed: " + data.message);
            }
        } catch (error) {
            console.error("Logout error:", error);
            alert("An error occurred while logging out.");
        }
    });
});
