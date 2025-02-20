const API_BASE_URL = "http://localhost:3000"; // Change this if needed

// ✅ Sign Up Function
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
        const response = await fetch(`${API_BASE_URL}/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password, phone })
        });

        const data = await response.json();
        if (response.ok) {
            alert("Signup successful! Please log in.");
            window.location.href = "LOGIN PAGE.html"; // Redirect after signup
        } else {
            alert(`Signup failed: ${data.message}`);
        }
    } catch (error) {
        console.error("Signup error:", error);
        alert("Something went wrong. Please try again later.");
    }
});

// ✅ Login Function
document.getElementById("login")?.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Please enter your email and password.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("user", JSON.stringify(data.user));
            alert("Login successful!");

            // Redirect based on user role
            if (data.user.admin) {
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

// ✅ Logout Function
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".logout")?.addEventListener("click", () => {
        localStorage.removeItem("user");
        alert("Logged out successfully!");
        window.location.href = "LANDING PAGE.html";
    });
});

// ✅ Load User Profile Data
document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        document.querySelector(".username").textContent = user.username;
        document.getElementById("username")?.setAttribute("value", user.username);
        document.getElementById("email")?.setAttribute("value", user.email);
        document.getElementById("contact")?.setAttribute("value", user.phone);
    }
});

// ✅ Enable Editing Profile Fields
document.getElementById("edit")?.addEventListener("click", () => {
    document.getElementById("username").removeAttribute("readonly");
    document.getElementById("email").removeAttribute("readonly");
    document.getElementById("contact").removeAttribute("readonly");
});

// ✅ Save Profile Updates
document.getElementById("save_changes")?.addEventListener("click", async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    const updatedUser = {
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("contact").value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/users/${user._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedUser)
        });

        if (response.ok) {
            alert("Profile updated successfully!");
            localStorage.setItem("user", JSON.stringify(updatedUser));
            window.location.reload(); // Refresh page
        } else {
            alert("Failed to update profile.");
        }
    } catch (error) {
        console.error("Profile update error:", error);
        alert("Something went wrong. Please try again later.");
    }
});
