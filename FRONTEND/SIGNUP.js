document.getElementById("signup")?.addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const phone = document.getElementById("contactNo").value.trim();

    if (!username || !email || !password || !phone) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5500/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password, phone }),
        });

        const data = await response.json();
        if (response.ok) {
            alert("Signup successful! Please log in.");
            window.location.href = "LOGIN PAGE.html";
        } else {
            alert(`Signup failed: ${data.message}`);
        }
    } catch (error) {
        console.error("Signup error:", error);
        alert("Something went wrong. Please try again later.");
    }
});
