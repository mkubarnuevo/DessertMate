// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
document.getElementById("login")?.addEventListener("click", async () => {       // X
    const email = document.getElementById("email").value.trim();                // X
    const password = document.getElementById("password").value.trim();          // X
                                                                                // X
    if (!email || !password) {                                                  // X
        alert("Please enter your email and password.");                         // X
        return;                                                                 // X
    }                                                                           // X
                                                                                // X
    try {                                                                       // X
        const response = await fetch("http://localhost:5500/login", {           // X
            method: "POST",                                                     // X
            headers: { "Content-Type": "application/json" },                    // X
            body: JSON.stringify({ email, password }),                          // X
        });                                                                     // X
                                                                                // X
        const data = await response.json();                                     // X
        if (response.ok) {                                                      // X
            console.log("Login response:", data);                               // X
            localStorage.setItem("loggedInUser", JSON.stringify(data.user));    // X
            alert("Login successful!");                                         // X
                                                                                // X
            if (data.user && data.user.admin) {                                 // X
                window.location.href = "ADMIN DASHBOARD (ADD MENU).html";       // X
            } else {                                                            // X
                window.location.href = "HOMEPAGE.html";                         // X
            }                                                                   // X
        } else {                                                                // X
            alert("Login failed: " + data.message);                             // X
        }                                                                       // X
    } catch (error) {                                                           // X
        console.error("Login error:", error);                                   // X
        alert("Something went wrong. Please try again later.");                 // X
    }                                                                           // X
});                                                                             // X
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX