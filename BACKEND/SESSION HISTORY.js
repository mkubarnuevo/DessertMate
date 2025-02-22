const express = require("express");
const router = express.Router();
const connectDB = require("./MONGODB DATABASE CONNECTION");

router.post("/save-chat", async (req, res) => {
    const { email, messages } = req.body;

    if (!email || !messages) {
        return res.status(400).json({ message: "Email and messages are required" });
    }

    try {
        const { sessionHistory } = await connectDB();
        const existingSession = await sessionHistory.findOne({ email });

        if (existingSession) {
            await sessionHistory.updateOne({ email }, { $push: { messages: { $each: messages } } });
        } else {
            await sessionHistory.insertOne({ email, messages });
        }

        res.status(200).json({ message: "Chat history saved successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.get("/get-chat/:email", async (req, res) => {
    const email = req.params.email;

    try {
        const { sessionHistory } = await connectDB();
        const chatSession = await sessionHistory.findOne({ email });

        if (!chatSession) {
            return res.status(404).json({ message: "No chat history found" });
        }

        res.status(200).json(chatSession);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
