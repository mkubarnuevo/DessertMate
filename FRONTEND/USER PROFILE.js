// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
document.addEventListener("DOMContentLoaded", () => {                               // X
    const user = JSON.parse(localStorage.getItem("loggedInUser"));                  // X
                                                                                    // X
    if (!user) {                                                                    // X
        alert("Session expired. Please log in again.");                             // X
        window.location.href = "/login.html";                                       // X
        return;                                                                     // X
    }                                                                               // X
                                                                                    // X
    const usernameInput = document.getElementById("username");                      // X
    const emailInput = document.getElementById("email");                            // X
    const phoneInput = document.getElementById("phone");                            // X
    const editButton = document.getElementById("edit");                             // X
    const saveButton = document.getElementById("save_changes");                     // X
                                                                                    // X
    usernameInput.value = user.username;                                            // X
    emailInput.value = user.email;                                                  // X
    phoneInput.value = user.phone;                                                  // X
                                                                                    // X
    saveButton.disabled = true;                                                     // X
                                                                                    // X
    editButton.addEventListener("click", () => {                                    // X
        usernameInput.removeAttribute("readonly");                                  // X
        emailInput.removeAttribute("readonly");                                     // X
        phoneInput.removeAttribute("readonly");                                     // X
        usernameInput.focus();                                                      // X
        saveButton.disabled = false;                                                // X
    });                                                                             // X
                                                                                    // X
    saveButton.addEventListener("click", () => {                                    // X
        const updatedUser = {                                                       // X
            username: usernameInput.value,                                          // X
            email: emailInput.value,                                                // X
            phone: phoneInput.value,                                                // X
        };                                                                          // X
                                                                                    // X
        fetch(`http://localhost:5500/update-profile/${user._id}`, {                 // X
            method: "PUT",                                                          // X
            headers: { "Content-Type": "application/json" },                        // X
            body: JSON.stringify(updatedUser),                                      // X
        })                                                                          // X
        .then(response => response.json())                                          // X
        .then(data => {                                                             // X
            if (data.message === "Profile updated successfully") {                  // X
                alert("Profile updated!");                                          // X
                localStorage.setItem("loggedInUser", JSON.stringify(data.user));    // X
                usernameInput.setAttribute("readonly", true);                       // X
                emailInput.setAttribute("readonly", true);                          // X
                phoneInput.setAttribute("readonly", true);                          // X
                saveButton.disabled = true;                                         // X
            } else {                                                                // X
                alert("Update failed: " + data.message);                            // X
            }                                                                       // X
        })                                                                          // X
        .catch(error => console.error("Error:", error));                            // X
    });                                                                             // X
});                                                                                 // X
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX