require('dotenv').config();
const express = require("express");
const router = express.Router();
const connectDB = require("./MONGODB DATABASE CONNECTION");
const { HfInference } = require("@huggingface/inference");

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;
const HUGGINGFACE_MODEL_ID = process.env.HUGGINGFACE_MODEL_ID;
const client = new HfInference(HUGGINGFACE_API_TOKEN);

if (!HUGGINGFACE_API_TOKEN || !HUGGINGFACE_MODEL_ID) {
    console.error("HUGGINGFACE_API_TOKEN or HUGGINGFACE_MODEL_ID is not set in environment variables.");
}

async function testFetch() {
    try {
        const response = await fetch('https://api.github.com/users/github');
        const data = await response.json();
        console.log('Fetch test successful:', data);
    } catch (error) {
        console.error('Fetch test failed:', error);
    }
}

testFetch();

async function getHuggingFaceResponse(message) {
    try {
        let prompt = message;
        let menusData = null;
        let productsData = null;

        // Fetch data from "menus" collection
        const menusResponse = await fetch("http://localhost:5500/api/chatbot/menus");
        if (menusResponse.ok) {
            menusData = await menusResponse.text();
        } else {
            prompt += "\n\nCould not retrieve some menu items at this time.";
        }

        // Fetch data from "products" collection
        const productsResponse = await fetch("http://localhost:5500/api/chatbot/products");
        if (productsResponse.ok) {
            productsData = await productsResponse.text();
        } else {
            prompt += "\n\nCould not retrieve some product items at this time.";
        }

        // Combine data
        let combinedData = "";
        if (menusData) {
            combinedData += `\n\nMenu Items:\n${menusData}`;
        }
        if (productsData) {
            combinedData += `\n\nProduct Items:\n${productsData}`;
        }

        prompt += combinedData;

        const chatCompletion = await client.chatCompletion({
            model: HUGGINGFACE_MODEL_ID,
            messages: [{ role: "user", content: prompt }],
            provider: "hf-inference",
            max_tokens: 500,
        });

        console.log("Hugging Face API response:", chatCompletion);
        return chatCompletion.choices[0].message.content;

    } catch (error) {
        console.error("Error getting Hugging Face response:", error);
        return "Sorry, I'm having trouble connecting to the chatbot.";
    }
}

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

        const botResponse = await getHuggingFaceResponse(messages[0].text);
        console.log("bot response:", botResponse);

        await sessionHistory.updateOne(
            { email: email },
            { $push: { messages: { text: botResponse, sender: "bot" } } },
            { upsert: true }
        );

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

router.post("/add-bot-response", async (req, res) => {
    const { email, botResponse } = req.body;

    console.log("Received add-bot-response request:", { email, botResponse });

    if (!email || !botResponse) {
        console.log("Email or bot response missing");
        return res.status(400).json({ message: "Email and bot response are required" });
    }

    try {
        const { sessionHistory } = await connectDB();
        console.log("Connected to sessionHistory collection");

        await sessionHistory.updateOne(
            { email: email },
            { $push: { messages: { text: botResponse, sender: "bot" } } },
            { upsert: true }
        );

        console.log("Bot response added to database");
        res.status(200).json({ message: "Bot response added successfully" });
    } catch (error) {
        console.error("Error adding bot response:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;