document.getElementById("login")?.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Please enter your email and password.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5500/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            console.log("Login response:", data);
            localStorage.setItem("user", JSON.stringify(data.user));
            alert("Login successful!");

            if (data.user && data.user.admin) {
                window.location.href = "ADMIN DASHBOARD (ADD MENU).html";
            } else {
                window.location.href = "HOMEPAGE.html";
            }
        } else {
            alert("Login failed: " + data.message);
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("Something went wrong. Please try again later.");
    }
});
