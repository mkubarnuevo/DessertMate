// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
document.addEventListener("DOMContentLoaded", () => {                       // X
    const logoutButton = document.querySelector(".logout");                 // X
                                                                            // X
    if (!logoutButton) {                                                    // X
        console.error("Logout button not found!");                          // X
        return;                                                             // X
    }                                                                       // X
                                                                            // X
    logoutButton.addEventListener("click", async () => {                    // X
        console.log("Logout button clicked!");                              // X
                                                                            // X
        try {                                                               // X
            const response = await fetch("http://localhost:5500/logout", {  // X
                method: "POST",                                             // X
                credentials: "include",                                     // X
                headers: { "Content-Type": "application/json" },            // X
            });                                                             // X
            const data = await response.json();                             // X
                                                                            // X
            console.log("Server response:", data);                          // X
                                                                            // X
            if (response.ok) {                                              // X
                alert("Logged out successfully!");                          // X
                localStorage.removeItem("user");                            // X
                window.location.href = "LOGIN PAGE.html";                   // X
            } else {                                                        // X
                alert("Logout failed: " + data.message);                    // X
            }                                                               // X
        } catch (error) {                                                   // X
            console.error("Logout error:", error);                          // X
            alert("An error occurred while logging out.");                  // X
        }                                                                   // X
    });                                                                     // X
});                                                                         // X
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX