// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
document.getElementById("signup")?.addEventListener("click", async () => {  // X
    const username = document.getElementById("username").value.trim();      // X
    const email = document.getElementById("email").value.trim();            // X
    const password = document.getElementById("password").value.trim();      // X
    const phone = document.getElementById("contactNo").value.trim();        // X
                                                                            // X
    if (!username || !email || !password || !phone) {                       // X
        alert("Please fill in all fields.");                                // X
        return;                                                             // X
    }                                                                       // X
                                                                            // X
    try {                                                                   // X
        const response = await fetch("http://localhost:5500/signup", {      // X
            method: "POST",                                                 // X
            credentials: "include",                                         // X
            headers: { "Content-Type": "application/json" },                // X
            body: JSON.stringify({ username, email, password, phone }),     // X
        });                                                                 // X
                                                                            // X
        const data = await response.json();                                 // X
        if (response.ok) {                                                  // X
            alert("Signup successful! Please log in.");                     // X
            window.location.href = "LOGIN PAGE.html";                       // X
        } else {                                                            // X
            alert(`Signup failed: ${data.message}`);                        // X
        }                                                                   // X
    } catch (error) {                                                       // X
        console.error("Signup error:", error);                              // X
        alert("Something went wrong. Please try again later.");             // X
    }                                                                       // X
});                                                                         // X
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX