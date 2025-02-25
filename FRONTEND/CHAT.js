document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const chatView = document.querySelector(".chatView");
    const chatInput = document.querySelector(".chatInput");
    const sendButton = document.querySelector(".sendButton");

    if (!user) {
        alert("Session expired. Please log in again.");
        window.location.href = "/login.html";
        return;
    }

    const displayMessage = (message, sender) => {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");
        messageDiv.classList.add(sender);
        messageDiv.textContent = message;
        chatView.appendChild(messageDiv);
        chatView.scrollTop = chatView.scrollHeight;
    };

    const loadChatHistory = async () => {
        try {
            console.log("Loading chat history...");
            const response = await fetch(`http://localhost:5500/get-chat/${user.email}`);

            console.log("Get chat response:", response);

            if (response.ok) {
                const data = await response.json();
                console.log("Chat history data:", data);
                if (data && data.messages) {
                    chatView.innerHTML = "";
                    data.messages.forEach((messageObj) => {
                        console.log("Message Object:", messageObj);
                        displayMessage(messageObj.text, messageObj.sender);
                    });
                }
            } else if (response.status === 404) {
                console.log("no chat history found");
                chatView.innerHTML = "";
            } else {
                console.error("Failed to load chat history:", response.statusText);
            }
        } catch (error) {
            console.error("Error loading chat history:", error);
        }
    };

    loadChatHistory();

    const sendMessage = async () => {
        const message = chatInput.value.trim();
        if (message) {
            displayMessage(message, "user");
            chatInput.value = "";

            try {
                console.log("Sending message:", message);

                const response = await fetch("http://localhost:5500/save-chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: user.email,
                        messages: [{ text: message, sender: "user" }],
                    }),
                });

                console.log("Save chat response:", response);

                if (response.ok) {
                    console.log("Message saved successfully");
                    loadChatHistory();
                } else {
                    console.error("Error saving chat:", response.statusText);
                }
            } catch (error) {
                console.error("Error saving chat:", error);
            }
        }
    };

    sendButton.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    // Optional: Polling for updates
    // const pollForUpdates = () => {
    //     setInterval(loadChatHistory, 5000);
    // };
    // pollForUpdates();
});